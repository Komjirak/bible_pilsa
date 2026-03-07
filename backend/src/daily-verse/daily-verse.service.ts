import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// 개역한글판 (1961, Public Domain) 전체 구절 풀 — bible-kjv-1961.json
const BIBLE_DATA_PATH = path.join(__dirname, 'data', 'bible-kjv-1961.json');

let _versePool: BibleVerse[] | null = null;

function getVersePool(): BibleVerse[] {
  if (!_versePool) {
    const raw = fs.readFileSync(BIBLE_DATA_PATH, 'utf-8');
    _versePool = JSON.parse(raw) as BibleVerse[];
  }
  return _versePool;
}

@Injectable()
export class DailyVerseService {
  getTodayVerse() {
    // KST 기준 오늘 날짜 (YYYY-MM-DD)
    const todayKST = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');

    const pool = getVersePool();

    // 날짜 기반 결정론적 선택 (같은 날 모든 사용자에게 동일 구절)
    const dayOfYear = dayjs(todayKST).diff(dayjs(todayKST).startOf('year'), 'day');
    const verseIndex = dayOfYear % pool.length;
    const verse = pool[verseIndex];

    return {
      date: todayKST,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
      charCount: verse.text.replace(/\s/g, '').length,
      verseRef: `${verse.book} ${verse.chapter}장 ${verse.verse}절`,
    };
  }
}
