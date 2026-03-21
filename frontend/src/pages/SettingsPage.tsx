import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import '../index.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pushTime, fontSize, setPushTime, setFontSize } = useSettingsStore();

  return (
    <div className="page-container">
      <div className="app-nav-bar" style={{ justifyContent: 'center', padding: '0 16px', backgroundColor: 'transparent' }}>
        <h1 style={{ margin: 0 }}>설정</h1>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>알림 설정</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 500 }}>푸시 알림 시간</span>
          <input 
            type="time" 
            value={pushTime} 
            onChange={(e) => setPushTime(e.target.value)} 
            style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>보기 설정</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '16px', fontWeight: 500 }}>텍스트 폰트 크기</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setFontSize('small')}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: fontSize === 'small' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', fontWeight: 600, fontSize: '14px', color: fontSize === 'small' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
            >
              작게
            </button>
            <button 
              onClick={() => setFontSize('medium')}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: fontSize === 'medium' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', fontWeight: 600, fontSize: '16px', color: fontSize === 'medium' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
            >
              중간
            </button>
            <button 
              onClick={() => setFontSize('large')}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: fontSize === 'large' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', fontWeight: 600, fontSize: '18px', color: fontSize === 'large' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
            >
              크게
            </button>
          </div>
        </div>
      </div>

      <button className="btn-secondary" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default SettingsPage;
