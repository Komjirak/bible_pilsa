// 완료 화면 (Completion)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { WeeklyCompleteModal } from '@/components/completion/WeeklyCompleteModal';
import { WeeklyCalendarStrip } from '@/components/home/WeeklyCalendarStrip';
import { useFullScreenAd } from '@/hooks/useFullScreenAd';
import type { CompleteResponse, DailyVerseResponse } from '@/types/api';

interface LocationState {
  result: CompleteResponse;
  verse: DailyVerseResponse;
  mode?: 'random' | 'sequential';
}

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
  alignItems: 'center',
  gap: '24px',
  padding: '32px 24px 16px',
};

const celebrationStyle: React.CSSProperties = {
  textAlign: 'center',
};

const adButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  borderRadius: '16px',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
};

const adButtonDisabledStyle: React.CSSProperties = {
  ...adButtonStyle,
  opacity: 0.5,
  cursor: 'default',
};

const progressCardStyle: React.CSSProperties = {
  width: '100%',
  padding: '20px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
};

const actionButtonsStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const primaryBtnStyle: React.CSSProperties = {
  height: '52px',
  borderRadius: '24px',
  backgroundColor: 'var(--color-primary)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  width: '100%',
  boxShadow: '0 4px 16px rgba(49, 130, 246, 0.2)',
};

const ghostBtnStyle: React.CSSProperties = {
  height: '52px',
  borderRadius: '24px',
  backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  width: '100%',
};

export default function CompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [showModal, setShowModal] = useState(false);
  const { isAdLoaded, showAd } = useFullScreenAd({ adType: 'interstitial', autoLoad: true });

  const result = state?.result;
  const verse = state?.verse;
  const mode = state?.mode || 'random';

  useEffect(() => {
    if (result?.weeklyComplete) {
      // 0.5초 후 모달 표시 (완료 애니메이션 후)
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [result?.weeklyComplete]);

  if (!result || !verse) {
    navigate('/');
    return null;
  }

  const handleGoHome = () => {
    if (isAdLoaded) {
      showAd(() => navigate('/'));
    } else {
      navigate('/');
    }
  };

  const weeklyStatus = {
    completedDays: Array(7).fill(false).map((_, i) => i < result.weekProgress.completed),
    completedCount: result.weekProgress.completed,
  };

  return (
    <div style={pageStyle}>
      <AppNavBar title={mode === 'random' ? "오늘 완료!" : "완료!"} />

      <div style={contentStyle} className="animate-fade-in">
        {/* 축하 영역 */}
        <div style={celebrationStyle}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--color-text-primary)',
          }}>
            {mode === 'random' ? "오늘 말씀 필사 완료!" : "필사 완료! 계속 해볼까요?"}
          </h2>
          <p className="body-2" style={{ color: 'var(--color-text-secondary)' }}>
            {verse.book} {verse.chapter}장 {verse.verse}절
          </p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
            유사도 {Math.round((result.similarity || 0) * 100)}%
          </p>
        </div>

        {/* 액션 버튼 */}
        <div style={actionButtonsStyle}>
          <button 
            style={primaryBtnStyle} 
            onClick={async () => {
              if (isAdLoaded) {
                try {
                  await showAd(() => navigate('/points'));
                } catch {
                  navigate('/points');
                }
              } else {
                navigate('/points');
              }
            }}
          >
            광고 시청 후 포인트 받기
          </button>
          <button style={ghostBtnStyle} onClick={handleGoHome}>
            홈으로
          </button>
        </div>

        {/* 주간 진행 현황 */}
        <div style={progressCardStyle}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'var(--color-text-primary)',
          }}>
            이번 주 진행 현황
          </h3>
          <WeeklyCalendarStrip
            completedDays={weeklyStatus.completedDays}
            completedCount={weeklyStatus.completedCount}
          />
        </div>


      </div>

      <CopyrightFooter />

      {/* 주간 완주 모달 */}
      {showModal && result.pointGranted && (
        <WeeklyCompleteModal
          pointAmount={result.pointGranted.amount}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
