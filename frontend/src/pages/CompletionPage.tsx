import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

const CompletionPage = () => {
  const navigate = useNavigate();
  const { completeToday, advanceSequential, totalPoints, isTodayCompleted } = useProgressStore();

  // 필사 완료 처리 (중복 방지 내장)
  if (!isTodayCompleted()) {
    completeToday();
    // 순서대로 모드일 경우 다음 절로 이동
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'sequential') {
      advanceSequential();
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: '#fff',
    }}>
      {/* 헤더 */}
      <div style={{
        textAlign: 'center', padding: '12px 16px',
        borderBottom: '1px solid #F2F4F6',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', margin: 0 }}>말씀필사</h1>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '48px 24px 24px',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '40px',
          background: 'linear-gradient(135deg, #EBF3FE, #D6E7FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '28px',
        }}>
          <span style={{ fontSize: '40px' }}>🙌</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#191F28', marginBottom: '12px' }}>
          필사를 완료했어요
        </h2>
        <p style={{ fontSize: '15px', color: '#8B95A1', textAlign: 'center', lineHeight: 1.6 }}>
          오늘의 말씀을 훌륭하게 적으셨네요!<br />
          현재 보유 달란트: <span style={{ color: '#3182F6', fontWeight: 700 }}>{totalPoints}</span>
        </p>
        <p style={{ fontSize: '13px', color: '#B0B8C1', marginTop: '8px' }}>
          7일 연속 완료 시 10 달란트 보너스!
        </p>

        {/* 보너스 광고 카드 */}
        <div style={{
          width: '100%', marginTop: '36px', backgroundColor: '#F8F9FA',
          padding: '20px', borderRadius: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#191F28', marginBottom: '4px' }}>
                보너스 달란트 받기
              </p>
              <p style={{ fontSize: '13px', color: '#8B95A1' }}>광고 보고 5 달란트 더 받기</p>
            </div>
            <button style={{
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: '#fff', color: '#3182F6',
              fontSize: '14px', fontWeight: 700, border: '1px solid #E5E8EB',
              cursor: 'pointer',
            }}>
              +5 받기
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            backgroundColor: '#3182F6', color: '#fff',
            fontSize: '17px', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;
