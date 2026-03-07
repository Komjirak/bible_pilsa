import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateBack } from '@/lib/toss-bridge';

interface AppNavBarProps {
  title: string;
  showBack?: boolean;
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  padding: '0 16px',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-primary)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const backBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  color: 'var(--color-text-primary)',
  fontSize: '20px',
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  letterSpacing: '-0.3px',
};

const spacerStyle: React.CSSProperties = {
  width: '44px',
  flexShrink: 0,
};

export function AppNavBar({ title, showBack = false }: AppNavBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigateBack();
    navigate(-1);
  };

  return (
    <nav style={navStyle}>
      {showBack ? (
        <button style={backBtnStyle} onClick={handleBack} aria-label="뒤로 가기">
          ‹
        </button>
      ) : (
        <div style={spacerStyle} />
      )}
      <h1 style={titleStyle}>{title}</h1>
      <div style={spacerStyle} />
    </nav>
  );
}
