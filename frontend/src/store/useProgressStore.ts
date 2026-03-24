import { create } from 'zustand';
import { safeStorage } from '../utils/safeStorage';

interface PointRecord {
  label: string;
  date: string;
  amount: number;
}

interface ProgressState {
  // 주간 완료 날짜 배열 (ISO string: "2026-03-21")
  completedDates: string[];
  // 순서대로 모드의 현재 인덱스
  sequentialIndex: number;
  // 달란트 총액
  totalPoints: number;
  // 달란트 이력
  pointHistory: PointRecord[];
  // 오늘 이미 필사 완료했는지
  isTodayCompleted: () => boolean;
  // 이번 주 완료 횟수
  getWeeklyCount: () => number;
  // 필사 완료 처리
  completeToday: () => void;
  // 순서대로 인덱스 증가
  advanceSequential: () => void;
  
  // 랜덤 모드의 현재 오프셋
  randomOffset: number;
  // 현재 유효한 랜덤 오프셋 가져오기 (초회차는 항상 0)
  getCurrentRandomOffset: () => number;
  // 랜덤 모드 오프셋 증가
  advanceRandom: () => void;
}

const STORAGE_KEY = 'bible_progress';

function loadState() {
  const raw = safeStorage.getItem(STORAGE_KEY);
  if (!raw) return { completedDates: [], sequentialIndex: 0, randomOffset: 0, totalPoints: 0, pointHistory: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { completedDates: [], sequentialIndex: 0, randomOffset: 0, totalPoints: 0, pointHistory: [] };
  }
}

function saveState(state: Pick<ProgressState, 'completedDates' | 'sequentialIndex' | 'randomOffset' | 'totalPoints' | 'pointHistory'>) {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), diff);
  return weekStart.toISOString().split('T')[0];
}

export const useProgressStore = create<ProgressState>((set, get) => {
  const saved = loadState();
  return {
    completedDates: saved.completedDates || [],
    sequentialIndex: saved.sequentialIndex || 0,
    randomOffset: saved.randomOffset || 0,
    totalPoints: saved.totalPoints || 0,
    pointHistory: saved.pointHistory || [],

    isTodayCompleted: () => {
      return get().completedDates.includes(getToday());
    },

    getCurrentRandomOffset: () => {
      // 오늘 이미 1회차 필사를 완료했다면 누적된 오프셋 사용, 아니면 새 날이므로 0
      return get().completedDates.includes(getToday()) ? get().randomOffset : 0;
    },

    getWeeklyCount: () => {
      const weekStart = getWeekStart();
      return get().completedDates.filter((d: string) => d >= weekStart).length;
    },

    completeToday: () => {
      const today = getToday();
      const state = get();
      if (state.completedDates.includes(today)) return; // 중복 방지

      const newDates = [...state.completedDates, today];
      const weekStart = getWeekStart();
      const weeklyCount = newDates.filter((d: string) => d >= weekStart).length;

      // 7일 연속 달성 시 보너스
      const isWeeklyBonus = weeklyCount === 7;
      const bonusPoints = isWeeklyBonus ? 10 : 0;

      const now = new Date();
      const timeLabel = `${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newHistory: PointRecord[] = [
        { label: '매일 필사 완료', date: timeLabel, amount: 1 },
        ...state.pointHistory,
      ];

      if (isWeeklyBonus) {
        newHistory.unshift({ label: '🎉 7일 연속 달성 보너스', date: timeLabel, amount: 10 });
      }

      const newState = {
        completedDates: newDates,
        sequentialIndex: state.sequentialIndex,
        randomOffset: 0, // 새 날짜 초회 달성 시 오프셋 리셋
        totalPoints: state.totalPoints + 1 + bonusPoints,
        pointHistory: newHistory,
      };

      saveState(newState);
      set(newState);
    },

    advanceSequential: () => {
      const state = get();
      const newIndex = state.sequentialIndex + 1;
      const newState = {
        ...state,
        sequentialIndex: newIndex,
      };
      saveState({ completedDates: newState.completedDates, sequentialIndex: newIndex, randomOffset: newState.randomOffset, totalPoints: newState.totalPoints, pointHistory: newState.pointHistory });
      set({ sequentialIndex: newIndex });
    },

    advanceRandom: () => {
      const state = get();
      const newOffset = state.randomOffset + 1;
      const newState = {
        ...state,
        randomOffset: newOffset,
      };
      saveState({ completedDates: newState.completedDates, sequentialIndex: newState.sequentialIndex, randomOffset: newOffset, totalPoints: newState.totalPoints, pointHistory: newState.pointHistory });
      set({ randomOffset: newOffset });
    },
  };
});
