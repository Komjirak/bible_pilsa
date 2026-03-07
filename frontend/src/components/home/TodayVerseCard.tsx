import React from 'react';
import type { DailyVerseResponse } from '@/types/api';
import { formatDate } from '@/lib/dateUtils';

interface TodayVerseCardProps {
  verse: DailyVerseResponse;
}

const cardStyle: React.CSSProperties = {
  position: 'relative',
  margin: '0 24px',
  padding: '32px 24px 28px',
  backgroundColor: '#FFFFFF', // 백색 종이
  borderRadius: '4px 20px 20px 4px', // 우측이 둥근 책 형태
  boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.05), -2px 0 4px rgba(0, 0, 0, 0.02)',
  borderLeft: '14px solid var(--color-primary)', // 파란색 성경책 책등(Spine)
  border: '1px solid rgba(0,0,0,0.05)',
  borderLeftWidth: '14px', // override 1px border
  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 8px)', // 제본선 그림자
};

const bookmarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-2px',
  right: '32px',
  width: '18px',
  height: '28px',
  backgroundColor: '#F04452', // Toss Red 리본 책갈피
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
  boxShadow: '0 2px 4px rgba(240, 68, 82, 0.4)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  paddingBottom: '12px',
  borderBottom: '2px dashed var(--color-bg-secondary)', // 양피지 책 줄
};

const todayLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--color-primary)',
  letterSpacing: '-0.3px',
};

const dateStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-tertiary)',
  fontWeight: 500,
};

const verseContainerStyle: React.CSSProperties = {
  position: 'relative',
};

const verseTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '20px',
  lineHeight: 1.65,
  letterSpacing: '-0.4px',
  color: 'var(--color-text-primary)',
  marginBottom: '18px',
  fontWeight: 600,
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const referenceStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--color-text-secondary)',
  fontWeight: 600,
  textAlign: 'right', // 보통 성경 구절 출처는 우측 정렬
  paddingTop: '8px',
};

export function TodayVerseCard({ verse }: TodayVerseCardProps) {
  return (
    <div style={cardStyle} className="animate-slide-up">
      <div style={bookmarkStyle} />
      
      <div style={headerStyle}>
        <span style={todayLabelStyle}>오늘의 말씀</span>
        <span style={dateStyle}>{formatDate(verse.date)}</span>
      </div>
      
      <div style={verseContainerStyle}>
        <p style={verseTextStyle}>{verse.text}</p>
        <p style={referenceStyle}>
          {verse.book} {verse.chapter}장 {verse.verse}절
        </p>
      </div>
    </div>
  );
}
