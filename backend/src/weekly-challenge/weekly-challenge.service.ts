import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointService } from '../point/point.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

const WEEKLY_COMPLETE_DAYS = 7;

@Injectable()
export class WeeklyChallengeService {
  private readonly logger = new Logger(WeeklyChallengeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pointService: PointService,
  ) {}

  // 해당 날짜가 속한 주의 월요일 (KST)
  private getWeekStart(dateStr: string): string {
    return dayjs(dateStr).tz('Asia/Seoul').startOf('isoWeek').format('YYYY-MM-DD');
  }

  async onDayCompleted(userKey: string, date: string) {
    const weekStart = this.getWeekStart(date);

    // 주간 레코드 upsert 및 completedDays 증가
    const challenge = await this.prisma.weeklyChallenge.upsert({
      where: { userKey_weekStart: { userKey, weekStart } },
      create: { userKey, weekStart, completedDays: 1, pointGranted: false },
      update: { completedDays: { increment: 1 } },
    });

    let pointGranted = false;

    // 7일 완주 & 아직 포인트 미지급
    if (challenge.completedDays >= WEEKLY_COMPLETE_DAYS && !challenge.pointGranted) {
      try {
        await this.pointService.grantWeeklyCompletePoint(userKey, weekStart);
        await this.prisma.weeklyChallenge.update({
          where: { userKey_weekStart: { userKey, weekStart } },
          data: { pointGranted: true },
        });
        pointGranted = true;
        this.logger.log(`[point] 7일 완주 포인트 지급 완료: userKey=${userKey} weekStart=${weekStart}`);
      } catch (err) {
        this.logger.error(`[point] 지급 실패: userKey=${userKey}`, err?.message);
      }
    }

    return {
      completedDays: challenge.completedDays,
      isWeeklyComplete: challenge.completedDays >= WEEKLY_COMPLETE_DAYS,
      pointGranted,
    };
  }

  async getWeeklyStatus(userKey: string) {
    const todayKST = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
    const weekStart = this.getWeekStart(todayKST);

    // 이번 주 완료 기록 조회
    const completions = await this.prisma.completionRecord.findMany({
      where: {
        userKey,
        date: {
          gte: weekStart,
          lte: dayjs(weekStart).add(6, 'day').format('YYYY-MM-DD'),
        },
      },
      select: { date: true },
      orderBy: { date: 'asc' },
    });

    const completedDates = completions.map((c) => c.date);

    // 주간 챌린지 상태
    const challenge = await this.prisma.weeklyChallenge.findUnique({
      where: { userKey_weekStart: { userKey, weekStart } },
    });

    // 요일별 완료 여부 (월~일)
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      dayjs(weekStart).add(i, 'day').format('YYYY-MM-DD'),
    );
    const completedDaysArr = weekDays.map((d) => completedDates.includes(d));

    return {
      weekStart,
      weekEnd: dayjs(weekStart).add(6, 'day').format('YYYY-MM-DD'),
      completedDays: completedDaysArr,
      completedCount: completedDates.length,
      pointGranted: challenge?.pointGranted ?? false,
      // 아래 수치들은 나중을 위한 공간
      totalCompletions: 0,
      totalPointsEarned: 0,
    };
  }
}

