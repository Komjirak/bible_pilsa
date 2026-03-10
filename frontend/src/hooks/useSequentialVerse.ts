import { useState, useEffect, useCallback } from 'react';
import { getSequentialVerse } from '@/lib/api';
import { getSampleSequentialVerse } from '@/data/sampleBible';
import type { DailyVerseResponse } from '@/types/api';

export const SEQUENTIAL_INDEX_KEY = 'bible-pilsa-seq-index';

type SequentialVerseData = DailyVerseResponse & { index: number; total: number };

interface SequentialVerseState {
  verse: SequentialVerseData | null;
  isLoading: boolean;
  error: string | null;
}

export function useSequentialVerse() {
  const [state, setState] = useState<SequentialVerseState>({
    verse: null,
    isLoading: false,
    error: null,
  });

  const getSavedIndex = useCallback(() => {
    const saved = localStorage.getItem(SEQUENTIAL_INDEX_KEY);
    const index = parseInt(saved ?? '0', 10);
    return isNaN(index) || index < 0 ? 0 : index;
  }, []);

  const loadVerse = useCallback(async (indexToLoad: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getSequentialVerse(indexToLoad);
      setState({ verse: data, isLoading: false, error: null });
    } catch {
      // Offline fallback
      const fallback = getSampleSequentialVerse(indexToLoad);
      setState({ verse: fallback as any, isLoading: false, error: null });
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    const currentIndex = getSavedIndex();
    loadVerse(currentIndex);
  }, [getSavedIndex, loadVerse]);

  // 완료 처리 후 다음 인덱스로 넘어가기
  const markCompletedAndLoadNext = useCallback(() => {
    const currentIndex = getSavedIndex();
    const nextIndex = currentIndex + 1;
    localStorage.setItem(SEQUENTIAL_INDEX_KEY, nextIndex.toString());
    loadVerse(nextIndex);
  }, [getSavedIndex, loadVerse]);

  // 수동으로 특정 인덱스 설정 (리셋 기능 등)
  const resetProgress = useCallback(() => {
    localStorage.setItem(SEQUENTIAL_INDEX_KEY, '0');
    loadVerse(0);
  }, [loadVerse]);

  return { ...state, markCompletedAndLoadNext, resetProgress };
}
