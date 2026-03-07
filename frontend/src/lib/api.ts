// BE REST API 클라이언트
// architecture.md의 API 명세 기준

import type {
  DailyVerseResponse,
  CompleteRequest,
  CompleteResponse,
  WeeklyStatusResponse,
  PointHistoryResponse,
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
  return request('/auth/token', {
    method: 'POST',
    body: JSON.stringify({ authorizationCode, referrer }),
  });
}

// 오늘의 말씀 조회
export async function getDailyVerse(): Promise<DailyVerseResponse> {
  return request<DailyVerseResponse>('/api/v1/daily-verse');
}

// 필사 완료 처리
export async function submitCompletion(
  data: CompleteRequest
): Promise<CompleteResponse> {
  return request<CompleteResponse>('/api/v1/complete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 주간 현황 조회
export async function getWeeklyStatus(): Promise<WeeklyStatusResponse> {
  return request<WeeklyStatusResponse>('/api/v1/weekly-status');
}

// 포인트 이력 조회
export async function getPointHistory(): Promise<PointHistoryResponse> {
  return request<PointHistoryResponse>('/api/v1/points/history');
}
