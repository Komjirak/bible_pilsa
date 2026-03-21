import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface VerseData {
  date?: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  charCount: number;
  verseRef: string;
}

interface VerseState {
  currentVerse: VerseData | null;
  isLoading: boolean;
  error: string | null;
  fetchTodayVerse: () => Promise<void>;
  fetchSequentialVerse: (index: number) => Promise<void>;
}

export const useVerseStore = create<VerseState>((set) => ({
  currentVerse: null,
  isLoading: false,
  error: null,
  
  fetchTodayVerse: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/api/v1/daily-verse');
      set({ currentVerse: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || '오늘의 말씀을 불러오지 못했습니다.', isLoading: false });
    }
  },

  fetchSequentialVerse: async (index: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/v1/daily-verse/sequential?index=${index}`);
      set({ currentVerse: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || '말씀을 불러오지 못했습니다.', isLoading: false });
    }
  },
}));
