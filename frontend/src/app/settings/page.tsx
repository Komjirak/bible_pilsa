// 설정 화면 (Settings)
import React, { useState, useEffect } from 'react';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { requestNotificationPermission } from '@/lib/toss-bridge';
import { useAuth } from '@/hooks/useAuth';
import { useUserSettings } from '@/hooks/useUserSettings';

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
  margin: '16px 0 0',
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
  marginLeft: '24px',
  marginRight: '24px',
  borderRadius: '16px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
  overflow: 'hidden',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
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
  borderRadius: '10px',
};

const segmentBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: active ? 600 : 400,
  backgroundColor: active ? 'var(--color-bg-primary)' : 'transparent',
  color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.15s',
  boxShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
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
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
});

const previewStyle = (fontSize: number): React.CSSProperties => ({
  padding: '16px 24px',
  margin: '0 24px',
  fontFamily: 'var(--font-ui)',
  fontSize: `${fontSize}px`,
  lineHeight: 1.7,
  color: 'var(--color-text-placeholder)',
  backgroundColor: 'var(--color-bg-tertiary)',
  borderRadius: '0 0 16px 16px',
});

export default function SettingsPage() {
  const { isLoggedIn } = useAuth();
  const { settings, updateSettings, isLoading } = useUserSettings(isLoggedIn);

  const [notifOn, setNotifOn] = useState(false);
  const [notifTime, setNotifTime] = useState('06:00');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  // Load from backend API
  useEffect(() => {
    if (settings) {
      setNotifOn(settings.notificationEnabled);
      if (settings.notificationTime) {
        setNotifTime(settings.notificationTime);
      }
    }
  }, [settings]);

  const handleNotifToggle = async () => {
    const nextState = !notifOn;
    if (nextState) {
      // 권한 요청 (브라우저/앱인토스)
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('알림 권한을 허용해주세요.');
        return;
      }
    }
    
    // UI 우선 반영
    setNotifOn(nextState);
    const success = await updateSettings(nextState, notifTime);
    if (!success) {
      // 롤백
      setNotifOn(!nextState);
      alert('설정 변경에 실패했습니다.');
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value; // "HH:mm" 형태
    setNotifTime(newTime);
    
    // 켜져있을 때만 바로 서버 업데이트
    if (notifOn) {
      await updateSettings(notifOn, newTime);
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
            <input 
              type="time" 
              value={notifTime} 
              onChange={handleTimeChange}
              disabled={isLoading || !isLoggedIn}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                border: 'none',
                backgroundColor: 'transparent',
                color: notifOn ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            />
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
      <div style={{ ...sectionStyle, marginTop: '28px' }}>
        <p style={sectionTitleStyle}>화면 설정</p>
        <div style={listStyle}>
          <div style={{ ...listItemStyle, borderBottom: 'none' }}>
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
      <div style={{ ...sectionStyle, marginTop: '28px' }}>
        <p style={sectionTitleStyle}>서비스 정보</p>
        <div style={listStyle}>
          <div
            style={{ ...listItemStyle, cursor: 'pointer' }}
            onClick={() => window.open('/legal/terms.html', '_blank')}
          >
            <span style={labelStyle}>서비스 이용약관</span>
            <span style={valueStyle}>›</span>
          </div>
          <div style={{ ...listItemStyle }}>
            <span style={labelStyle}>성경 말씀 출처</span>
            <span style={valueStyle}>개역한글 (1961)</span>
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
