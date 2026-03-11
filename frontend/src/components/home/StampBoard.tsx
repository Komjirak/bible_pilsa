import React from 'react';

interface StampBoardProps {
  completedCount: number;
  total?: number;
}

const containerStyle: React.CSSProperties = {
  padding: '0 24px',
};

const boardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  marginBottom: '12px',
};

const slotStyle = (filled: boolean, isNext: boolean): React.CSSProperties => ({
  width: '100%',
  maxWidth: '44px',
  aspectRatio: '1/1',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  backgroundColor: filled ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
  color: '#fff',
  border: isNext ? '2px solid var(--color-primary)' : '1px solid var(--color-border-light)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: filled ? '0 4px 12px rgba(49, 130, 246, 0.25)' : 'none',
  position: 'relative',
});

const progressTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
  textAlign: 'center',
  fontWeight: 600,
  marginTop: '4px',
};

const rewardMarkStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-4px',
  top: '-4px',
  backgroundColor: '#FFD700', // Gold
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  border: '2px solid #fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 2,
};

export function StampBoard({ completedCount, total = 7 }: StampBoardProps) {
  const slots = Array.from({ length: total }, (_, i) => i);

  return (
    <div style={containerStyle}>
      <div style={boardStyle}>
        {slots.map((idx) => {
          const isFilled = idx < completedCount;
          const isNext = idx === completedCount;
          const isLast = idx === total - 1;
          
          return (
            <div 
              key={idx} 
              style={slotStyle(isFilled, isNext)}
            >
              {isFilled ? '📖' : ''}
              {isLast && (
                <div style={rewardMarkStyle}>P</div>
              )}
            </div>
          );
        })}
      </div>
      <p style={progressTextStyle}>
        {completedCount >= total ? '🎉 이번 주 목표 달성!' : `이번 주 ${completedCount}번 완료 (목표: ${total}번)`}
      </p>
    </div>
  );
}
