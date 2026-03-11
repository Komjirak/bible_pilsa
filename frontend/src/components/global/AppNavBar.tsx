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
  fontFamily: 'var(--font-ui)', /* Toss DS typography */
  fontSize: '17px',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  letterSpacing: '-0.3px',
};

const spacerStyle: React.CSSProperties = {
  width: '44px',
  flexShrink: 0,
};

export function AppNavBar({ title, showBack, showSettings }: AppNavBarProps & { showSettings?: boolean }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (showBack) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
      navigateBack(); // Toss bridge call
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <nav style={navStyle}>
      <div style={spacerStyle}>
        {showBack && (
          <button style={backBtnStyle} onClick={handleBack} aria-label="뒤로가기">
            ‹
          </button>
        )}
      </div>
      
      <h1 style={titleStyle}>{title}</h1>
      
      <div style={spacerStyle}>
        {showSettings && (
          <button 
            style={{ ...backBtnStyle, fontSize: '24px' }} 
            onClick={handleSettings} 
            aria-label="설정"
          >
            ⚙️
          </button>
        )}
      </div>
    </nav>
  );
}
