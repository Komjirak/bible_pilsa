import { create } from 'zustand';
import { safeStorage } from '../utils/safeStorage';

interface SettingsState {
  pushTime: string;
  fontSize: 'small' | 'medium' | 'large';
  setPushTime: (time: string) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pushTime: safeStorage.getItem('pushTime') || '09:00',
  fontSize: (safeStorage.getItem('fontSize') as 'small' | 'medium' | 'large') || 'medium',
  setPushTime: (time) => {
    safeStorage.setItem('pushTime', time);
    set({ pushTime: time });
  },
  setFontSize: (size) => {
    safeStorage.setItem('fontSize', size);
    set({ fontSize: size });
  },
}));
