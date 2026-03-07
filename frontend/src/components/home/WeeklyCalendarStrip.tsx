import React from 'react';
import { DAY_LABELS } from '@/lib/dateUtils';

interface WeeklyCalendarStripProps {
  completedDays: boolean[];
  completedCount: number;
}

const containerStyle: React.CSSProperties = {
  padding: '0 24px',
};

const stripStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '4px',
  marginBottom: '10px',
};

const dayStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  flex: 1,
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-tertiary)',
  fontWeight: 500,
};

const progressStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--color-text-secondary)',
  textAlign: 'center',
};

function DayIndicator({
  completed,
  isToday,
}: {
  completed: boolean;
  isToday: boolean;
}) {
  const size = 32;
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  if (completed) {
    return (
      <div
        style={{
          ...base,
          backgroundColor: 'var(--color-primary)', // Toss Blue
          color: '#fff',
        }}
      >
        ✓
      </div>
    );
  }

  if (isToday) {
    return (
      <div
        style={{
          ...base,
          border: '2px solid var(--color-primary)', // Toss Blue
          color: 'var(--color-primary)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...base,
        border: '1.5px solid var(--color-border-strong)', // Subtle border
        color: 'var(--color-text-disabled)',
      }}
    />
  );
}

export function WeeklyCalendarStrip({
  completedDays,
  completedCount,
}: WeeklyCalendarStripProps) {
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div style={containerStyle}>
      <div style={stripStyle}>
        {DAY_LABELS.map((label, idx) => (
          <div key={label} style={dayStyle}>
            <span style={labelStyle}>{label}</span>
            <DayIndicator
              completed={completedDays[idx] ?? false}
              isToday={idx === todayIndex}
            />
          </div>
        ))}
      </div>
      <p style={progressStyle}>이번 주 {completedCount}/7일 완료</p>
    </div>
  );
}
