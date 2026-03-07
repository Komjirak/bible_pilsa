// BE REST API 클라이언트
// architecture.md의 API 명세 기준

import type {
  DailyVerseResponse,
  CompleteRequest,
  CompleteResponse,
  WeeklyStatusResponse,
  PointHistoryResponse,
  UserSettingsResponse,
} from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// JWT 토큰 스토리지 (sessionStorage — localStorage 금지)
const TOKEN_KEY = 'bible-pilsa-token';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// 인증
export async function exchangeToken(
  authorizationCode: string,
  referrer: string
): Promise<{ token: string; expiresIn: number }> {
  const data = await request<{ accessToken: string }>('/auth/token', {
    method: 'POST',
    body: JSON.stringify({ authorizationCode, referrer }),
  });
  // 백엔드는 accessToken을 반환하지만, 프론트엔드는 token으로 사용
  return { token: data.accessToken, expiresIn: 604800 };
}

// 오늘의 말씀 조회
export async function getDailyVerse(): Promise<DailyVerseResponse> {
  return request<DailyVerseResponse>('/api/v1/daily-verse');
}

// 필사 완료 처리
export async function submitCompletion(
  data: CompleteRequest
): Promise<CompleteResponse> {
  // 프론트엔드 필드명 → 백엔드 DTO 필드명 매핑
  const backendBody = {
    date: data.date,
    verseRef: (data as any).verseRef || '', // WritingPage에서 전달
    userInput: data.typedText,
    durationMs: data.typingDurationMs,
  };
  const res = await request<any>('/api/v1/complete', {
    method: 'POST',
    body: JSON.stringify(backendBody),
  });
  // 백엔드 응답 → 프론트엔드 타입 매핑
  return {
    success: true,
    similarity: (res.similarity ?? 0) / 100, // 백엔드는 0-100 정수, 프론트는 0-1
    weekProgress: {
      completed: res.weeklyCompletedDays ?? 0,
      total: 7,
    },
    weeklyComplete: res.weeklyComplete ?? false,
    pointGranted: res.pointAmount > 0 ? {
      amount: res.pointAmount,
      status: 'completed',
    } : null,
  };
}

// 주간 현황 조회
export async function getWeeklyStatus(): Promise<WeeklyStatusResponse> {
  return request<WeeklyStatusResponse>('/api/v1/weekly-status');
}


// 포인트 이력 조회
export async function getPointHistory(): Promise<PointHistoryResponse> {
  return request<PointHistoryResponse>('/api/v1/points/history');
}

// 사용자 설정 조회
export async function getUserSettings(): Promise<UserSettingsResponse> {
  return request<UserSettingsResponse>('/api/v1/users/me/settings');
}

// 알림 설정 업데이트
export async function updateNotificationSettings(
  enabled: boolean,
  time?: string
): Promise<UserSettingsResponse> {
  return request<UserSettingsResponse>('/api/v1/users/me/notification', {
    method: 'PATCH',
    body: JSON.stringify({ enabled, time }),
  });
}
