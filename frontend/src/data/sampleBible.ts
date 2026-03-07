// 개발용 샘플 성경 데이터 (개역한글판 퍼블릭 도메인)
// 실제 서비스에서는 BE /api/v1/daily-verse에서 수신

import type { DailyVerseResponse } from '@/types/api';

export const SAMPLE_VERSES: DailyVerseResponse[] = [
  {
    date: '2026-03-06',
    book: '요한복음',
    chapter: 3,
    verse: 16,
    text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라',
  },
  {
    date: '2026-03-07',
    book: '시편',
    chapter: 23,
    verse: 1,
    text: '여호와는 나의 목자시니 내가 부족함이 없으리로다',
  },
  {
    date: '2026-03-08',
    book: '빌립보서',
    chapter: 4,
    verse: 13,
    text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
  },
  {
    date: '2026-03-09',
    book: '잠언',
    chapter: 3,
    verse: 5,
    text: '너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라',
  },
  {
    date: '2026-03-10',
    book: '이사야',
    chapter: 40,
    verse: 31,
    text: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리의 날개치며 올라감 같을 것이요 달음박질하여도 곤비치 아니하겠고 걸어가도 피곤치 아니하리로다',
  },
];

export function getSampleVerseForToday(): DailyVerseResponse {
  const today = new Date().toISOString().split('T')[0];
  const found = SAMPLE_VERSES.find((v) => v.date === today);
  return found ?? SAMPLE_VERSES[0];
}
