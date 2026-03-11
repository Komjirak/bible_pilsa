// 포인트 현황 화면 (Points)
import React, { useEffect, useState } from 'react';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { StampBoard } from '@/components/home/StampBoard';
import { useWeeklyStatus } from '@/hooks/useWeeklyStatus';
import { useAuth } from '@/hooks/useAuth';
import { getPointHistory } from '@/lib/api';
import { getWeekLabel } from '@/lib/dateUtils';
import type { PointHistoryItem } from '@/types/api';

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
  gap: '20px',
  padding: '20px 24px',
};

const bannerStyle: React.CSSProperties = {
  padding: '28px 24px',
  backgroundColor: 'var(--color-primary-subtle)',
  borderRadius: '24px',
  textAlign: 'center',
};

const sectionStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
};

const historyItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid var(--color-border)',
};

const statusBadgeStyle = (status: string): React.CSSProperties => ({
  fontSize: '12px',
  fontWeight: 600,
  padding: '3px 10px',
  borderRadius: '20px',
  backgroundColor:
    status === 'completed' ? 'rgba(47, 133, 90, 0.12)' : 'rgba(139,143,150,0.12)',
  color: status === 'completed' ? 'var(--color-success)' : 'var(--color-text-tertiary)',
});

export default function PointsPage() {
  const { isLoggedIn } = useAuth();
  const { status } = useWeeklyStatus(isLoggedIn);
  const [history, setHistory] = useState<PointHistoryItem[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    getPointHistory()
      .then((data) => {
        setTotalEarned(data.totalEarned);
        setHistory(data.completions.slice(0, 12));
      })
      .catch(() => {
        setTotalEarned(status?.totalPointsEarned ?? 0);
      });
  }, [isLoggedIn, status?.totalPointsEarned]);

  return (
    <div style={pageStyle}>
      <AppNavBar title="포인트 현황" />
      <div style={contentStyle} className="animate-fade-in">
        {/* 총 포인트 배너 */}
        <div style={bannerStyle}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            지금까지 모은 포인트
          </p>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '40px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: '6px',
          }}>
            {totalEarned}원
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            7일 완주 {Math.floor(totalEarned / 10)}회 달성
          </p>
        </div>

        {/* 이번 주 현황 */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
            이번 주 현황
          </h3>
          <StampBoard
            completedCount={status?.completedCount ?? 0}
          />
          {status?.pointGranted && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: 'rgba(47, 133, 90, 0.08)',
              borderRadius: '12px',
              fontSize: '13px',
              color: 'var(--color-success)',
              textAlign: 'center',
              fontWeight: 500,
            }}>
              ✓ 이번 주 포인트 적립 완료
            </div>
          )}
        </div>

        {/* 완주 기록 */}
        {history.length > 0 && (
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              완주 기록
            </h3>
            {history.map((item, idx) => (
              <div key={idx} style={{
                ...historyItemStyle,
                borderBottom: idx < history.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {getWeekLabel(item.weekStart)}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    {item.amount}원 적립
                  </p>
                </div>
                <span style={statusBadgeStyle(item.status)}>
                  {item.status === 'completed' ? '완료' : item.status === 'pending' ? '처리 중' : '실패'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />

      {/* 홈으로 돌아가기 버튼 */}
      <div style={{ padding: '0 24px 20px' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          홈으로 돌아가기
        </button>
      </div>

      <CopyrightFooter />
    </div>
  );
}
