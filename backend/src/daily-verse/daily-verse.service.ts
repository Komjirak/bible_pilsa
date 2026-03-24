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

/** DJB2 해시 — 날짜 문자열을 의사 난수 인덱스로 변환 */
function hashDateToIndex(dateStr: string, poolSize: number): number {
  let hash = 5381;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) + hash + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash % poolSize;
}

@Injectable()
export class DailyVerseService {
  getTodayVerse() {
    // KST 기준 오늘 날짜 (YYYY-MM-DD)
    const todayKST = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');

    const pool = getVersePool();

    // 날짜 해시 기반 의사 난수 선택 (같은 날 = 같은 구절, 매일 랜덤)
    const verseIndex = hashDateToIndex(todayKST, pool.length);
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

  getVerseByIndex(index: number) {
    const pool = getVersePool();
    // bounds check
    let safeIndex = index;
    if (isNaN(safeIndex) || safeIndex < 0) safeIndex = 0;
    if (safeIndex >= pool.length) safeIndex = pool.length - 1;

    const verse = pool[safeIndex];

    return {
      index: safeIndex,
      total: pool.length,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text,
      charCount: verse.text.replace(/\s/g, '').length,
      verseRef: `${verse.book} ${verse.chapter}장 ${verse.verse}절`,
    };
  }
}
