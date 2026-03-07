import { useState, useEffect, useCallback } from 'react';
import { getWeeklyStatus } from '@/lib/api';
import { getTodayKST } from '@/lib/dateUtils';
import type { WeeklyStatusResponse } from '@/types/api';

interface WeeklyStatusState {
  status: WeeklyStatusResponse | null;
  isLoading: boolean;
  isTodayCompleted: boolean;
}

const DEFAULT_STATUS: WeeklyStatusResponse = {
  weekStart: getTodayKST(),
  weekEnd: getTodayKST(),
  completedDays: [false, false, false, false, false, false, false],
  completedCount: 0,
  pointGranted: false,
  totalCompletions: 0,
  totalPointsEarned: 0,
};

export function useWeeklyStatus(isLoggedIn: boolean) {
  const [state, setState] = useState<WeeklyStatusState>({
    status: null,
    isLoading: false,
    isTodayCompleted: false,
  });

  const fetchStatus = useCallback(async () => {
    if (!isLoggedIn) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const data = await getWeeklyStatus();
      // 오늘이 완료인지 확인 (월=0, 일=6 기준)
      const todayIndex = (new Date().getDay() + 6) % 7;
      const isTodayCompleted = data.completedDays[todayIndex] ?? false;
      setState({ status: data, isLoading: false, isTodayCompleted });
    } catch {
      setState({ status: DEFAULT_STATUS, isLoading: false, isTodayCompleted: false });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { ...state, refetch: fetchStatus };
}
