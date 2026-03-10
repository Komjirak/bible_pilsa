export interface DailyVerseResponse {
  date: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface WeekProgress {
  completed: number;
  total: number;
}

export interface PointGranted {
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface CompleteResponse {
  success: boolean;
  similarity: number;
  weekProgress: WeekProgress;
  weeklyComplete: boolean;
  pointGranted: PointGranted | null;
}

export interface WeeklyStatusResponse {
  weekStart: string;
  weekEnd: string;
  completedDays: boolean[];
  completedCount: number;
  pointGranted: boolean;
  totalCompletions: number;
  totalPointsEarned: number;
}

export interface PointHistoryItem {
  weekStart: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface PointHistoryResponse {
  totalEarned: number;
  completions: PointHistoryItem[];
}

export interface CompleteRequest {
  date: string;
  typedText: string;
  typingDurationMs: number;
  typingStartAt: string;
  pasteAttempts: number;
  clientSimilarity: number;
}

export interface ApiError {
  errorCode: string;
  message: string;
}

export interface UserSettingsResponse {
  notificationEnabled: boolean;
  notificationTime: string | null;
  fontSize: string | null;
}
