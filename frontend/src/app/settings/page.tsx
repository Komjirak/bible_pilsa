// 설정 화면 (Settings)
import React, { useState } from 'react';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { requestNotificationPermission } from '@/lib/toss-bridge';

type FontSize = 'small' | 'medium' | 'large';
const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 28,
  medium: 30,
  large: 33,
};
const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: '소',
  medium: '중',
  large: '대',
};

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-primary)',
};

const sectionStyle: React.CSSProperties = {
  margin: '12px 0 0',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '0 24px 8px',
};

const listStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-secondary)',
  borderTop: '1px solid var(--color-border)',
  borderBottom: '1px solid var(--color-border)',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  borderBottom: '1px solid var(--color-border)',
  minHeight: '54px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '16px',
  color: 'var(--color-text-primary)',
};

const valueStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--color-text-secondary)',
};

const segmentStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  backgroundColor: 'var(--color-bg-tertiary)',
  padding: '3px',
  borderRadius: '8px',
};

const segmentBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: active ? 600 : 400,
  backgroundColor: active ? 'var(--color-bg-primary)' : 'transparent',
  color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.15s',
});

const toggleStyle = (on: boolean): React.CSSProperties => ({
  width: '48px',
  height: '28px',
  borderRadius: '14px',
  backgroundColor: on ? 'var(--color-primary)' : 'var(--color-border)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  border: 'none',
});

const toggleKnobStyle = (on: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: '3px',
  left: on ? '23px' : '3px',
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  transition: 'left 0.2s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
});

const previewStyle = (fontSize: number): React.CSSProperties => ({
  padding: '12px 24px',
  fontFamily: 'var(--font-verse)',
  fontSize: `${fontSize}px`,
  lineHeight: 1.7,
  color: 'var(--color-text-placeholder)',
  backgroundColor: 'var(--color-bg-tertiary)',
});

export default function SettingsPage() {
  const [notifOn, setNotifOn] = useState(false);
  const [notifTime, setNotifTime] = useState('오전 6:00');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  const handleNotifToggle = async () => {
    if (!notifOn) {
      const granted = await requestNotificationPermission();
      setNotifOn(granted);
    } else {
      setNotifOn(false);
    }
  };

  return (
    <div style={pageStyle}>
      <AppNavBar title="설정" showBack />

      {/* 알림 설정 */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}>알림 설정</p>
        <div style={listStyle}>
          <div style={listItemStyle}>
            <span style={labelStyle}>매일 알림 시간</span>
            <span style={valueStyle}>{notifTime}</span>
          </div>
          <div style={{ ...listItemStyle, borderBottom: 'none' }}>
            <span style={labelStyle}>알림 켜기</span>
            <button style={toggleStyle(notifOn)} onClick={handleNotifToggle} aria-label="알림 토글">
              <div style={toggleKnobStyle(notifOn)} />
            </button>
          </div>
        </div>
      </div>

      {/* 화면 설정 */}
      <div style={{ ...sectionStyle, marginTop: '24px' }}>
        <p style={sectionTitleStyle}>화면 설정</p>
        <div style={listStyle}>
          <div style={listItemStyle}>
            <span style={labelStyle}>글자 크기</span>
            <div style={segmentStyle}>
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  style={segmentBtnStyle(fontSize === size)}
                  onClick={() => setFontSize(size)}
                >
                  {FONT_SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 미리보기 */}
        <div style={previewStyle(FONT_SIZE_MAP[fontSize])}>
          태초에 하나님이 천지를 창조하시니라
        </div>
      </div>

      {/* 서비스 정보 */}
      <div style={{ ...sectionStyle, marginTop: '24px' }}>
        <p style={sectionTitleStyle}>서비스 정보</p>
        <div style={listStyle}>
          <div
            style={{ ...listItemStyle, cursor: 'pointer' }}
            onClick={() => window.open('https://bible-pilsa.apps.tossmini.com/privacy', '_blank')}
          >
            <span style={labelStyle}>개인정보처리방침</span>
            <span style={valueStyle}>›</span>
          </div>
          <div style={{ ...listItemStyle, cursor: 'pointer' }}>
            <span style={labelStyle}>오픈소스 라이선스</span>
            <span style={valueStyle}>›</span>
          </div>
          <div style={{ ...listItemStyle, borderBottom: 'none' }}>
            <span style={labelStyle}>버전</span>
            <span style={valueStyle}>1.0.0</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <CopyrightFooter />
    </div>
  );
}
