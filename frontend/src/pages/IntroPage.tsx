import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const APP_ICON = 'https://static.toss.im/appsintoss/5277/5d9b8f52-2eba-4b03-93df-e77bb3241c73.png';

const IntroPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { appLogin } = await import('@apps-in-toss/web-bridge');
      const { authorizationCode } = await appLogin();

      if (authorizationCode) {
        navigate('/home');
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Toss appLogin failed:', err);
      if (import.meta.env.DEV || err?.code === 'USER_CANCELLED') {
        navigate('/home');
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: '#fff', padding: '0 24px',
    }}>
      {/* 타이틀 */}
      <div style={{ paddingTop: '60px', marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '26px', fontWeight: 800, color: '#191F28',
          lineHeight: 1.4, letterSpacing: '-0.5px',
        }}>
          매일 성경 말씀을 필사하고<br />포인트 받아가세요
        </h1>
      </div>

      {/* 3 Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <img
            src={APP_ICON}
            alt="말씀필사"
            style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>
              오늘의 말씀 필사
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              하루 한 절의 성경 말씀을 직접 써봐요
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <img
            src={APP_ICON}
            alt="7일 연속"
            style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>
              7일 연속 달성
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              매일 필사하여 7일 연속 목표를 달성하세요
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '22px',
            backgroundColor: '#3182F6', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px', color: '#fff',
            fontWeight: 800, flexShrink: 0,
          }}>P</div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>
              토스 포인트
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              적립된 포인트는 토스 앱에서 자유롭게 사용하세요
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ paddingBottom: '20px' }}>
        <button
          onClick={handleStart}
          disabled={isLoading}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            backgroundColor: '#3182F6', color: '#fff',
            fontSize: '17px', fontWeight: 600, border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? '로그인 중...' : '시작하기'}
        </button>
        <p style={{
          textAlign: 'center', fontSize: '12px', color: '#B0B8C1',
          marginTop: '12px',
        }}>
          성경 번역 출처: 대한성서공회 개역한글판 (1961년판)
        </p>
      </div>
    </div>
  );
};

export default IntroPage;
