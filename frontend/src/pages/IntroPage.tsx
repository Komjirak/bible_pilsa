import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import '../index.css';

const IntroPage: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleStart = async () => {
    await login();
    const authState = useAuthStore.getState();
    if (authState.isAuthenticated) {
      navigate('/writing');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="app-nav-bar">
        <h1>말씀필사</h1>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 40px 24px' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
            매일 성경 말씀을 필사하고<br />포인트 받아가세요
          </h1>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-primary-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>
              📖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                오늘의 말씀 필사
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                하루 한 절의 성경 말씀을 직접 써봐요
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-primary-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>
              📆
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                7일 연속 달성
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                매일 필사하여 7일 연속 목표를 달성하세요
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'white', fontWeight: 'bold', flexShrink: 0
            }}>
              P
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                토스 포인트
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                적립된 달란트는 토스포인트로 교환해 자유롭게 사용하세요
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button
            style={{
              width: '100%', height: '56px', borderRadius: '24px', backgroundColor: 'var(--color-accent)',
              color: '#fff', fontSize: '17px', fontWeight: 600, cursor: 'pointer', border: 'none'
            }}
            onClick={handleStart}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
