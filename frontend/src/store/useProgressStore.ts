import { create } from 'zustand';
import { safeStorage } from '../utils/safeStorage';
import { fetchProgress, saveProgress } from '../api/client';

interface PointRecord {
  label: string;
  date: string;
  amount: number;
}

interface ProgressState {
  completedDates: string[];
  sequentialIndex: number;
  totalPoints: number;
  pointHistory: PointRecord[];
  randomOffset: number;
  isSynced: boolean;

  isTodayCompleted: () => boolean;
  getWeeklyCount: () => number;
  getCurrentRandomOffset: () => number;

  // 서버에서 진도 로드 (앱 시작 시 호출)
  syncFromServer: () => Promise<void>;
  completeToday: () => void;
  advanceSequential: () => void;
  advanceRandom: () => void;
}

const STORAGE_KEY = 'bible_progress';

function loadLocal() {
  const raw = safeStorage.getItem(STORAGE_KEY);
  if (!raw) return { completedDates: [], sequentialIndex: 0, randomOffset: 0, totalPoints: 0, pointHistory: [] };
  try { return JSON.parse(raw); } catch { return { completedDates: [], sequentialIndex: 0, randomOffset: 0, totalPoints: 0, pointHistory: [] }; }
}

function persist(state: Pick<ProgressState, 'completedDates' | 'sequentialIndex' | 'randomOffset' | 'totalPoints' | 'pointHistory'>) {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getToday(): string {
  const kstDate = new Date(Date.now() + 9 * 3600000);
  return kstDate.toISOString().split('T')[0];
}

function getWeekStart(): string {
  const kstDate = new Date(Date.now() + 9 * 3600000);
  const day = kstDate.getUTCDay();
  kstDate.setUTCDate(kstDate.getUTCDate() - day);
  return kstDate.toISOString().split('T')[0];
}

export const useProgressStore = create<ProgressState>((set, get) => {
  const saved = loadLocal();

  return {
    completedDates: saved.completedDates || [],
    sequentialIndex: saved.sequentialIndex || 0,
    randomOffset: saved.randomOffset || 0,
    totalPoints: saved.totalPoints || 0,
    pointHistory: saved.pointHistory || [],
    isSynced: false,

    isTodayCompleted: () => get().completedDates.includes(getToday()),

    getCurrentRandomOffset: () =>
      get().completedDates.includes(getToday()) ? get().randomOffset : 0,

    getWeeklyCount: () => {
      const weekStart = getWeekStart();
      return get().completedDates.filter((d: string) => d >= weekStart).length;
    },

    // 서버에서 진도 로드 — 로그인 후 호출
    syncFromServer: async () => {
      const serverData = await fetchProgress();
      if (!serverData) return; // 미인증 or 오프라인 → localStorage 유지

      // 서버 데이터와 로컬 데이터 중 더 앞선 값 사용
      const local = loadLocal();
      const merged = {
        sequentialIndex: Math.max(serverData.sequentialIndex, local.sequentialIndex || 0),
        completedDates: mergeArrays(serverData.completedDates, local.completedDates || []),
        randomOffset: Math.max(serverData.randomOffset, local.randomOffset || 0),
        totalPoints: Math.max(serverData.totalPoints, local.totalPoints || 0),
        pointHistory: mergePointHistory(serverData.pointHistory, local.pointHistory || []),
      };

      persist(merged);
      set({ ...merged, isSynced: true });

      // 병합된 최신 데이터를 서버에 다시 저장
      saveProgress(merged);
    },

    completeToday: () => {
      const today = getToday();
      const state = get();
      if (state.completedDates.includes(today)) return;

      const newDates = [...state.completedDates, today];
      const weekStart = getWeekStart();
      const weeklyCount = newDates.filter((d: string) => d >= weekStart).length;
      const isWeeklyBonus = weeklyCount === 7;
      const bonusPoints = isWeeklyBonus ? 10 : 0;

      const now = new Date();
      const timeLabel = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newHistory: PointRecord[] = [
        { label: '매일 필사 완료', date: timeLabel, amount: 1 },
        ...state.pointHistory,
      ];
      if (isWeeklyBonus) {
        newHistory.unshift({ label: '🎉 7일 연속 달성 보너스', date: timeLabel, amount: 10 });
      }

      const next = {
        completedDates: newDates,
        sequentialIndex: state.sequentialIndex,
        randomOffset: 0,
        totalPoints: state.totalPoints + 1 + bonusPoints,
        pointHistory: newHistory,
      };
      persist(next);
      set(next);
      saveProgress(next);
    },

    advanceSequential: () => {
      const state = get();
      const next = { ...state, sequentialIndex: state.sequentialIndex + 1 };
      persist({ completedDates: next.completedDates, sequentialIndex: next.sequentialIndex, randomOffset: next.randomOffset, totalPoints: next.totalPoints, pointHistory: next.pointHistory });
      set({ sequentialIndex: next.sequentialIndex });
      saveProgress({ sequentialIndex: next.sequentialIndex });
    },

    advanceRandom: () => {
      const state = get();
      const next = { ...state, randomOffset: state.randomOffset + 1 };
      persist({ completedDates: next.completedDates, sequentialIndex: next.sequentialIndex, randomOffset: next.randomOffset, totalPoints: next.totalPoints, pointHistory: next.pointHistory });
      set({ randomOffset: next.randomOffset });
      saveProgress({ randomOffset: next.randomOffset });
    },
  };
});

function mergeArrays(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b])).sort();
}

function mergePointHistory(
  a: PointRecord[],
  b: PointRecord[],
): PointRecord[] {
  const seen = new Set<string>();
  return [...a, ...b].filter((r) => {
    const key = `${r.date}-${r.label}-${r.amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
