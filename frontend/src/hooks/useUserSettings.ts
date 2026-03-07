import { useState, useEffect, useCallback } from 'react';
import { getUserSettings, updateNotificationSettings } from '@/lib/api';
import type { UserSettingsResponse } from '@/types/api';

interface UserSettingsState {
  settings: UserSettingsResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserSettings(isLoggedIn: boolean) {
  const [state, setState] = useState<UserSettingsState>({
    settings: null,
    isLoading: false,
    error: null,
  });

  const fetchSettings = useCallback(async () => {
    if (!isLoggedIn) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getUserSettings();
      setState({ settings: data, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '설정 조회 실패';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (enabled: boolean, time?: string) => {
    try {
      const updated = await updateNotificationSettings(enabled, time);
      setState((prev) => ({ ...prev, settings: updated }));
      return true;
    } catch {
      return false;
    }
  };

  return { ...state, updateSettings, refetch: fetchSettings };
}
