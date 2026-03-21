import { create } from 'zustand';

interface SettingsState {
  pushTime: string;
  fontSize: 'small' | 'medium' | 'large';
  setPushTime: (time: string) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pushTime: '09:00',
  fontSize: 'medium',
  setPushTime: (time) => set({ pushTime: time }),
  setFontSize: (size) => set({ fontSize: size }),
}));
