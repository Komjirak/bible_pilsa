// 홈 화면 (Home)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { TodayVerseCard } from '@/components/home/TodayVerseCard';
import { StampBoard } from '@/components/home/StampBoard';
import { BannerAd } from '@/components/ads/BannerAd';
import { useAuth } from '@/hooks/useAuth';
import { useDailyVerse } from '@/hooks/useDailyVerse';
import { useSequentialVerse } from '@/hooks/useSequentialVerse';
import { useWeeklyStatus } from '@/hooks/useWeeklyStatus';
import { SequentialProgress } from '@/components/home/SequentialProgress';
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
  borderRadius: '24px',
  backgroundColor: 'var(--color-accent)',
  color: '#fff',
  fontSize: '17px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  letterSpacing: '-0.3px',
  transition: 'background-color 0.15s, transform 0.1s',
  boxShadow: '0 4px 16px rgba(209, 92, 50, 0.2)',
};

const alreadyDoneCardStyle: React.CSSProperties = {
  margin: '0 24px',
  padding: '24px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  textAlign: 'center',
};

const loginBtnStyle: React.CSSProperties = {
  ...ctaBtnStyle,
  margin: '0',
  width: '100%',
};

export const BIBLE_MODE_KEY = 'bible-pilsa-mode';
type BibleMode = 'random' | 'sequential';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, login } = useAuth();
  
  // 랜덤 모드 (오늘의 말씀)
  const { verse: dailyVerse, isLoading: dailyLoading } = useDailyVerse(isLoggedIn);
  // 순서대로 모드
  const { verse: seqVerse, isLoading: seqLoading, resetProgress } = useSequentialVerse();
  
  const { status, isTodayCompleted, refetch } = useWeeklyStatus(isLoggedIn);

  const [mode, setMode] = React.useState<BibleMode>(() => {
    return (localStorage.getItem(BIBLE_MODE_KEY) as BibleMode) || 'random';
  });

  const handleModeChange = (newMode: BibleMode) => {
    setMode(newMode);
    localStorage.setItem(BIBLE_MODE_KEY, newMode);
  };

  const handleStartWriting = () => {
    navigate('/writing');
  };

  if (!isLoggedIn) {
    return (
      <div style={pageStyle}>
        <AppNavBar title="말씀필사" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 40px 24px' }}>
          {/* Header Title */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
              매일 성경 말씀을 필사하고<br />포인트 받아가세요
            </h1>
          </div>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E8F3FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
              }}>
                📖
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  오늘의 말씀 필사
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  하루 한 절의 성경 말씀을 직접 써봐요
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E8F3FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
              }}>
                📆
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  7일 연속 달성
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  매일 필사하여 7일 연속 목표를 달성하세요
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#3182F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'white', fontWeight: 'bold', flexShrink: 0
              }}>
                P
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  토스 포인트
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  적립된 포인트는 토스 앱에서 자유롭게 사용하세요
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button
              style={loginBtnStyle}
              onClick={login}
              disabled={authLoading}
            >
              {authLoading ? '로그인 중...' : '시작하기'}
            </button>
          </div>
        </div>
        <CopyrightFooter />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <AppNavBar title="말씀필사" showSettings />
      <div style={contentStyle}>
        {/* 모드 선택 */}
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', backgroundColor: 'var(--color-bg-secondary)', 
            borderRadius: '20px', padding: '4px', gap: '4px', width: '100%'
          }}>
            <button
              style={{
                flex: 1, padding: '10px 0', borderRadius: '16px',
                backgroundColor: mode === 'random' ? 'var(--color-bg-primary)' : 'transparent',
                color: mode === 'random' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: mode === 'random' ? 700 : 500,
                boxShadow: mode === 'random' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              onClick={() => handleModeChange('random')}
            >
              오늘의 말씀
            </button>
            <button
              style={{
                flex: 1, padding: '10px 0', borderRadius: '16px',
                backgroundColor: mode === 'sequential' ? 'var(--color-bg-primary)' : 'transparent',
                color: mode === 'sequential' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: mode === 'sequential' ? 700 : 500,
                boxShadow: mode === 'sequential' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              onClick={() => handleModeChange('sequential')}
            >
              순서대로
            </button>
          </div>
        </div>

        {mode === 'random' ? (
          dailyLoading || !dailyVerse ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              말씀을 불러오는 중...
            </div>
          ) : (
            <TodayVerseCard verse={dailyVerse} />
          )
        ) : (
          <SequentialProgress 
            verse={seqVerse} 
            isLoading={seqLoading} 
            onReset={() => {
              if (confirm('순서대로 필사 진도를 초기화하시겠습니까?')) {
                resetProgress();
              }
            }} 
          />
        )}

        <StampBoard
          completedCount={status?.completedCount ?? 0}
        />

        {(mode === 'random' && isTodayCompleted) ? (
          <div style={alreadyDoneCardStyle} className="animate-slide-up">
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>✅</p>
            <p style={{
              fontFamily: 'var(--font-verse)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
            }}>
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

        {/* 하단 배너 광고 */}
        <div style={{ padding: '0 24px' }}>
          <BannerAd adUnitId="ait.v2.live.65db39c0f5d24194" />
        </div>

        <div style={{ display: 'flex', gap: '12px', padding: '0 24px' }}>
          <button
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onClick={() => navigate('/points')}
          >
            포인트 현황
          </button>
          <button
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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
