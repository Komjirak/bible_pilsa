// 설정 화면 (Settings)
import React, { useState, useEffect, useRef } from 'react';
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

// localStorage 키 상수
export const FONT_SIZE_STORAGE_KEY = 'bible-pilsa-font-size';

// 저장된 폰트 사이즈 읽기 (외부에서도 사용 가능)
export function getSavedFontSize(): number {
  const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSize | null;
  return FONT_SIZE_MAP[saved ?? 'medium'] ?? 30;
}

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

const toastStyle = (visible: boolean): React.CSSProperties => ({
  position: 'fixed',
  bottom: visible ? '40px' : '0px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(51, 61, 75, 0.9)',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '24px',
  fontSize: '14px',
  fontWeight: 500,
  opacity: visible ? 1 : 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  pointerEvents: 'none',
  zIndex: 1000,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
});

export default function SettingsPage() {
  const { isLoggedIn } = useAuth();
  const { settings, updateSettings, isLoading } = useUserSettings(isLoggedIn);

  const [notifOn, setNotifOn] = useState(false);
  const [notifTime, setNotifTime] = useState('06:00');
  // localStorage에서 저장된 폰트 사이즈 불러오기
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSize | null;
    return (saved && ['small', 'medium', 'large'].includes(saved)) ? saved : 'medium';
  });

  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = () => {
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Load from backend API
  useEffect(() => {
    if (settings) {
      setNotifOn(settings.notificationEnabled);
      setNotifTime(settings.notificationTime || '09:00');
      if (settings.fontSize && ['small', 'medium', 'large'].includes(settings.fontSize)) {
        setFontSize(settings.fontSize as FontSize);
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, settings.fontSize);
      }
    }
  }, [settings]);

  // fontSize 변경 시 localStorage + DB 저장
  const handleFontSizeChange = async (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
    if (isLoggedIn) {
      const success = await updateSettings(undefined, undefined, size);
      if (success) showToast();
    } else {
      showToast();
    }
  };

  const handleNotifToggle = async () => {
    const nextState = !notifOn;
    if (nextState) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        // 권한 없어도 토글 켜기 (토스 앱에서는 별도 권한 화면으로 이동)
        console.warn('[Settings] 알림 권한 없음');
      }
    }

    setNotifOn(nextState);
    const success = await updateSettings(nextState, notifTime);
    if (!success) {
      setNotifOn(!nextState);
      console.warn('[Settings] 알림 설정 저장 실패');
    } else {
      showToast();
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotifTime(newTime);
    if (notifOn) {
      const success = await updateSettings(notifOn, newTime);
      if (success) showToast();
    } else {
      showToast(); // 시간만 변경해도 로컬 UI론 반영되므로 피드백 줌
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
                cursor: 'pointer',
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
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          padding: '12px 24px 0',
          lineHeight: 1.5
        }}>
          💡 알림을 켜두시면 매일 설정한 시간에 오늘의 말씀 필사를 잊지 않도록 안내해 드려요.
        </p>
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
                  onClick={() => handleFontSizeChange(size)}
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

      {/* 설정 저장 토스트 */}
      <div style={toastStyle(toastVisible)}>
        설정이 저장되었습니다
      </div>
    </div>
  );
}
