import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      // 에러가 나거나 취소해도 개발환경/테스트 용이를 위해 홈으로 넘김
      if (import.meta.env.DEV || err?.code === 'USER_CANCELLED') {
        navigate('/home');
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: 'var(--screen-height, 100vh)',
      backgroundColor: '#fff', padding: '0 24px',
    }}>
      {/* 상단 타이틀 영역 */}
      <div style={{ paddingTop: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: '#8B95A1', marginBottom: '8px', fontWeight: 600 }}>
          오늘의 마음 운동
        </p>
        <h1 style={{
          fontSize: '28px', fontWeight: 800, color: '#191F28', margin: 0,
        }}>
          말씀 필사하기
        </h1>
      </div>

      {/* 중앙 큰 아이콘 */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '32px 0 48px',
      }}>
        <img
          src={APP_ICON}
          alt="메인 아이콘"
          style={{ width: '120px', height: '120px', borderRadius: '24px' }}
        />
      </div>

      {/* 스텝 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        {/* 연결선 (배경) */}
        <div style={{
          position: 'absolute', top: '24px', bottom: '40px', left: '19px',
          width: '2px', backgroundColor: '#F2F4F6', zIndex: 0,
        }} />

        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>📖</div>
          <div style={{ paddingTop: '2px' }}>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '6px' }}>
              하루 한 절 성경 필사
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              매일 주어지는 새로운 말씀을<br />직접 따라 써보세요
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>🎯</div>
          <div style={{ paddingTop: '2px' }}>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '6px' }}>
              7일 연속 달성
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              꾸준히 참여하여<br />7일 연속 목표를 달성하세요
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#FFD12B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 800, color: '#fff',
          }}>P</div>
          <div style={{ paddingTop: '2px' }}>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#191F28', marginBottom: '6px' }}>
              필사하고 보상도 받아요
            </div>
            <div style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.4 }}>
              꾸준히 필사학고 달란트를 모아<br />다양한 보상을 받을 수 있어요
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ paddingBottom: '24px', backgroundColor: '#fff', paddingTop: '16px' }}>
        <button
          onClick={handleStart}
          disabled={isLoading}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            backgroundColor: '#3182F6', color: '#fff',
            fontSize: '17px', fontWeight: 600, border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.2)'
          }}
        >
          {isLoading ? '로그인 중...' : '시작하기'}
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
