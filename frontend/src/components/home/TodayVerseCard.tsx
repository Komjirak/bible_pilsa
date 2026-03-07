import React from 'react';
import type { DailyVerseResponse } from '@/types/api';
import { formatDate } from '@/lib/dateUtils';

interface TodayVerseCardProps {
  verse: DailyVerseResponse;
}

const cardStyle: React.CSSProperties = {
  margin: '0 24px',
  padding: '20px',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '16px',
  border: '1px solid var(--color-border)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
};

const todayLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const dateStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-text-tertiary)',
};

const verseTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-verse)',
  fontSize: '20px',
  lineHeight: 1.7,
  letterSpacing: '-0.2px',
  color: 'var(--color-text-primary)',
  marginBottom: '14px',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const referenceStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-secondary)',
  fontWeight: 500,
};

export function TodayVerseCard({ verse }: TodayVerseCardProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={todayLabelStyle}>오늘의 말씀</span>
        <span style={dateStyle}>{formatDate(verse.date)}</span>
      </div>
      <p style={verseTextStyle}>{verse.text}</p>
      <p style={referenceStyle}>
        {verse.book} {verse.chapter}장 {verse.verse}절
      </p>
    </div>
  );
}
