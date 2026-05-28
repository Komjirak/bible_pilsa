import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('komjirak_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // 서버가 토큰을 거부 → 로컬 토큰 제거 후 재로그인 유도
      localStorage.removeItem('komjirak_token');
      // useAuthStore는 여기서 직접 import하면 순환 의존이 생기므로
      // storage 이벤트로 간접 처리 (useAuthStore.initialize가 구독)
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);

export interface ProgressData {
  sequentialIndex: number;
  completedDates: string[];
  randomOffset: number;
  totalPoints: number;
  pointHistory: { label: string; date: string; amount: number }[];
}

export async function fetchProgress(): Promise<ProgressData | null> {
  try {
    const res = await apiClient.get('/api/v1/progress');
    return res.data as ProgressData;
  } catch {
    return null;
  }
}

export async function saveProgress(data: Partial<ProgressData>): Promise<void> {
  try {
    await apiClient.post('/api/v1/progress', data);
  } catch {
    // 서버 저장 실패 시 무시 (localStorage 데이터 유지)
  }
}
