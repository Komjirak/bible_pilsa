// 홈 화면 (Home)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { TodayVerseCard } from '@/components/home/TodayVerseCard';
import { WeeklyCalendarStrip } from '@/components/home/WeeklyCalendarStrip';
import { useAuth } from '@/hooks/useAuth';
import { useDailyVerse } from '@/hooks/useDailyVerse';
import { useWeeklyStatus } from '@/hooks/useWeeklyStatus';
import { getCountdownToMidnight } from '@/lib/dateUtils';

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-primary)',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  paddingTop: '24px',
  paddingBottom: '16px',
};

const ctaBtnStyle: React.CSSProperties = {
  margin: '0 24px',
  height: '56px',
  borderRadius: '14px',
  backgroundColor: 'var(--color-primary)',
  color: '#fff',
  fontSize: '17px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  letterSpacing: '-0.3px',
  transition: 'background-color 0.15s',
};

const alreadyDoneCardStyle: React.CSSProperties = {
  margin: '0 24px',
  padding: '20px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '14px',
  border: '1px solid var(--color-border)',
  textAlign: 'center',
};

const loginBtnStyle: React.CSSProperties = {
  ...ctaBtnStyle,
  backgroundColor: 'var(--color-primary)',
};

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, login } = useAuth();
  const { verse, isLoading: verseLoading } = useDailyVerse(isLoggedIn);
  const { status, isTodayCompleted, refetch } = useWeeklyStatus(isLoggedIn);

  const handleStartWriting = () => {
    navigate('/writing');
  };

  if (!isLoggedIn) {
    return (
      <div style={pageStyle}>
        <AppNavBar title="말씀필사" />
        <div style={{ ...contentStyle, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📖</p>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              말씀필사
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
              하루 한 절, 성경 말씀을 직접 써보세요.
            </p>
            <button
              style={loginBtnStyle}
              onClick={login}
              disabled={authLoading}
            >
              {authLoading ? '로그인 중...' : '토스로 시작하기'}
            </button>
          </div>
        </div>
        <CopyrightFooter />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <AppNavBar title="말씀필사" />
      <div style={contentStyle}>
        {verseLoading || !verse ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
            말씀을 불러오는 중...
          </div>
        ) : (
          <TodayVerseCard verse={verse} />
        )}

        <WeeklyCalendarStrip
          completedDays={status?.completedDays ?? Array(7).fill(false)}
          completedCount={status?.completedCount ?? 0}
        />

        {isTodayCompleted ? (
          <div style={alreadyDoneCardStyle}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>✅</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              오늘 말씀 완료!
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              내일 새 말씀까지 {getCountdownToMidnight()}
            </p>
          </div>
        ) : (
          <button style={ctaBtnStyle} onClick={handleStartWriting}>
            지금 필사하기
          </button>
        )}

        <div style={{ display: 'flex', gap: '12px', padding: '0 24px' }}>
          <button
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/points')}
          >
            포인트 현황
          </button>
          <button
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={() => { refetch(); navigate('/settings'); }}
          >
            설정
          </button>
        </div>
      </div>
      <CopyrightFooter />
    </div>
  );
}
