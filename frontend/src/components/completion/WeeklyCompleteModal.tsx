import React from 'react';

interface WeeklyCompleteModalProps {
  pointAmount: number;
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '24px',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-primary)',
  borderRadius: '24px',
  padding: '36px 28px',
  textAlign: 'center',
  width: '100%',
  maxWidth: '320px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
};

const emojiStyle: React.CSSProperties = {
  fontSize: '48px',
  marginBottom: '16px',
  display: 'block',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-verse)',
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  marginBottom: '12px',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '15px',
  color: 'var(--color-text-secondary)',
  lineHeight: 1.6,
  marginBottom: '28px',
};

const pointStyle: React.CSSProperties = {
  color: 'var(--color-accent)',
  fontWeight: 700,
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  borderRadius: '16px',
  backgroundColor: 'var(--color-accent)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  transition: 'background-color 0.15s',
};

export function WeeklyCompleteModal({ pointAmount, onClose }: WeeklyCompleteModalProps) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} className="animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <span style={emojiStyle}>🎉</span>
        <h2 style={titleStyle}>이번 주 완주!</h2>
        <p style={bodyStyle}>
          말씀필사 7일 완주를 축하드려요!<br />
          토스 포인트{' '}
          <span style={pointStyle}>{pointAmount}원</span>이 적립됩니다.
        </p>
        <button style={btnStyle} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
