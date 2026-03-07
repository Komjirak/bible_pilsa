import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeeklyChallengeService } from '../weekly-challenge/weekly-challenge.service';
import { PointService } from '../point/point.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import * as path from 'path';
import * as fs from 'fs';

dayjs.extend(utc);
dayjs.extend(timezone);

// 성경 구절 타입 (bible-kjv-1961.json)
interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// 개역한글판 성경 데이터 (253구절) — Lazy Load
const BIBLE_DATA_PATH = path.join(__dirname, '..', 'daily-verse', 'data', 'bible-kjv-1961.json');
let _versePool: BibleVerse[] | null = null;

function getVersePool(): BibleVerse[] {
  if (!_versePool) {
    const raw = fs.readFileSync(BIBLE_DATA_PATH, 'utf-8');
    _versePool = JSON.parse(raw) as BibleVerse[];
  }
  return _versePool;
}

const SIMILARITY_THRESHOLD = 0.85;
const MIN_DURATION_MS = 3000; // 3초 미만 = Fraud 의심

@Injectable()
export class CompletionService {
  private readonly logger = new Logger(CompletionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly weeklyChallengeService: WeeklyChallengeService,
    private readonly pointService: PointService,
  ) {}

  async submitCompletion(
    userKey: string,
    dto: { date: string; verseRef: string; userInput: string; durationMs: number },
  ) {
    const { date, verseRef, userInput, durationMs } = dto;

    // 1) 날짜 유효성 (KST 오늘 날짜만 허용)
    const todayKST = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
    if (date !== todayKST) {
      throw new BadRequestException('오늘 날짜의 필사만 제출 가능합니다');
    }

    // 2) Fraud 감지: 최소 타이핑 시간
    if (durationMs < MIN_DURATION_MS) {
      this.logger.warn(`[fraud] userKey=${userKey} durationMs=${durationMs} — too fast`);
      throw new BadRequestException('입력이 너무 빠릅니다. 실제로 따라 써주세요');
    }

    // 3) 서버사이드 유사도 검증 (Levenshtein 기반)
    const originalText = await this.getOriginalVerseText(verseRef);
    const similarity = this.calculateSimilarity(
      userInput.replace(/\s/g, ''),
      originalText.replace(/\s/g, ''),
    );

    if (similarity < SIMILARITY_THRESHOLD) {
      throw new BadRequestException(
        `유사도가 부족합니다 (${Math.round(similarity * 100)}%). 정확히 따라 써주세요`,
      );
    }

    // 4) 중복 완료 방지 (DB UNIQUE)
    try {
      await this.prisma.completionRecord.create({
        data: { userKey, date, verseRef, similarityScore: similarity },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('오늘은 이미 필사를 완료했습니다');
      }
      throw err;
    }

    // 5) 주간 챌린지 업데이트 + 포인트 지급 확인
    const weeklyResult = await this.weeklyChallengeService.onDayCompleted(userKey, date);

    return {
      date,
      similarity: Math.round(similarity * 100),
      weeklyCompletedDays: weeklyResult.completedDays,
      weeklyComplete: weeklyResult.isWeeklyComplete,
      pointGranted: weeklyResult.pointGranted,
      pointAmount: weeklyResult.isWeeklyComplete ? Number(process.env.WEEKLY_COMPLETE_POINT_AMOUNT ?? 10) : 0,
    };
  }

  private async getOriginalVerseText(verseRef: string): Promise<string> {
    // bible-kjv-1961.json에서 구절 조회 (253개 구절 전체 지원)
    const pool = getVersePool();
    // verseRef 형식: "요한복음 3:16" 또는 "요한복음 3장 16절"
    const verse = pool.find((v) => {
      const refA = `${v.book} ${v.chapter}:${v.verse}`;
      const refB = `${v.book} ${v.chapter}장 ${v.verse}절`;
      return verseRef === refA || verseRef === refB;
    });
    return verse?.text ?? '';
  }

  private calculateSimilarity(a: string, b: string): number {
    if (!a || !b) return 0;
    if (a === b) return 1;
    const len = Math.max(a.length, b.length);
    const dist = this.levenshtein(a, b);
    return 1 - dist / len;
  }

  private levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }
}
