import { useState, useEffect } from 'react';
import { getDailyVerse } from '@/lib/api';
import { getSampleVerseForToday } from '@/data/sampleBible';
import type { DailyVerseResponse } from '@/types/api';

interface DailyVerseState {
  verse: DailyVerseResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useDailyVerse(isLoggedIn: boolean) {
  const [state, setState] = useState<DailyVerseState>({
    verse: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // 개발 환경에서 미로그인 상태면 샘플 데이터 즉시 사용
    if (!isLoggedIn) {
      if (import.meta.env.DEV) {
        setState({ verse: getSampleVerseForToday(), isLoading: false, error: null });
      }
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    getDailyVerse()
      .then((verse) => {
        if (!cancelled) setState({ verse, isLoading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          // 오프라인 폴백: 샘플 데이터 사용
          const fallback = getSampleVerseForToday();
          setState({ verse: fallback, isLoading: false, error: null });
        }
      });

    return () => { cancelled = true; };
  }, [isLoggedIn]);

  return state;
}
