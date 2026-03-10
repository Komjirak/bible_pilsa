import React from 'react';
import type { DailyVerseResponse } from '@/types/api';

interface SequentialProgressProps {
  verse: (DailyVerseResponse & { index: number; total: number }) | null;
  isLoading: boolean;
  onReset?: () => void;
}

const cardStyle: React.CSSProperties = {
  margin: '0 24px',
  padding: '24px 20px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-verse)',
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  marginBottom: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const progressContainerStyle: React.CSSProperties = {
  height: '8px',
  backgroundColor: 'var(--color-border-strong)',
  borderRadius: '4px',
  overflow: 'hidden',
  margin: '16px 0',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
  textAlign: 'right',
  fontWeight: 500,
};

const resetBtnStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-text-tertiary)',
  textDecoration: 'underline',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

export function SequentialProgress({ verse, isLoading, onReset }: SequentialProgressProps) {
  if (isLoading || !verse) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
        말씀을 불러오는 중...
      </div>
    );
  }

  const { index, total, book, chapter, verse: verseNum } = verse;
  const progressPercent = ((index / total) * 100).toFixed(2);

  return (
    <div style={cardStyle} className="animate-fade-in">
      <div style={titleStyle}>
        <span>📖 {book} {chapter}장 {verseNum}절</span>
        {onReset && (
          <button style={resetBtnStyle} onClick={onReset}>처음부터</button>
        )}
      </div>
      
      <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        성경 완독을 향한 여정
      </div>

      <div style={progressContainerStyle}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          backgroundColor: 'var(--color-primary)',
          transition: 'width 0.5s ease-out',
        }} />
      </div>

      <div style={subtitleStyle}>
        전체 {total.toLocaleString()}절 중 <strong>{index + 1}</strong>절 완료 ({progressPercent}%)
      </div>
    </div>
  );
}
