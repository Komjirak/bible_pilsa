// KST 날짜 유틸리티

export function getTodayKST(): string {
  const now = new Date();
  // KST = UTC+9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export function getWeekDays(weekStart: string): Date[] {
  const start = new Date(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일`;
}

export function getWeekLabel(weekStart: string): string {
  const date = new Date(weekStart);
  const month = date.getMonth() + 1;
  const weekNum = Math.ceil(date.getDate() / 7);
  const weekNames = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
  return `${month}월 ${weekNames[weekNum - 1] ?? weekNum + '번째'} 주`;
}

export function getCountdownToMidnight(): string {
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const tomorrow = new Date(kstNow);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - kstNow.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}시간 ${minutes}분 후`;
}

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
