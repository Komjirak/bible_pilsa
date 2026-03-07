import React from 'react';

const styles: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px 24px 16px',
  color: 'var(--color-text-tertiary)',
  fontSize: '11px',
  lineHeight: 1.4,
};

export function CopyrightFooter() {
  return (
    <footer style={styles}>
      성경 번역 출처: 대한성서공회 개역한글판 (1961년판)
    </footer>
  );
}
