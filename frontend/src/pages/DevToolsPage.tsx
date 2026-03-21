import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

const PROMOTION_CODE_TEST = 'TEST_01KKBXJR87B4GAEVGGTK81Y3CA';

const DevToolsPage = () => {
  const navigate = useNavigate();
  const { totalPoints, getWeeklyCount } = useProgressStore();
  
  const [testResult, setTestResult] = useState('');

  // 7일 연속 달성을 시뮬레이션하기 위해 강제로 localStorage 조작
  const simulate7Days = () => {
    try {
      const dates = [];
      const today = new Date();
      // 오늘 포함 과거 6일 생성 (총 7일)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      
      const raw = localStorage.getItem('bible_progress');
      const state = raw ? JSON.parse(raw) : {};
      state.completedDates = dates;
      localStorage.setItem('bible_progress', JSON.stringify(state));
      
      // Zustand 스토어 리로드 유도
      window.location.reload();
    } catch (err) {
      console.error(err);
      setTestResult('시뮬레이션 데이터 주입 실패');
    }
  };

  const testPromotion = async () => {
    setTestResult('테스트 프로모션 호출 중...');
    try {
      const { grantPromotionReward } = await import('@apps-in-toss/web-framework');
      
      // 7일 연속 보너스는 10 포인트
      const amount = 10;
      
      const result = await grantPromotionReward({
        params: {
          promotionCode: PROMOTION_CODE_TEST,
          amount,
        },
      });

      if (!result) {
        setTestResult('지원하지 않는 앱 버전 (undefined)');
        return;
      }
      if (result === 'ERROR') {
        setTestResult('알 수 없는 오류 (ERROR)');
        return;
      }
      if ('key' in result) {
        setTestResult(`✅ 지급 성공! key: ${result.key}`);
        return;
      }
      if ('errorCode' in result) {
        setTestResult(`❌ 실패: ${result.errorCode} - ${result.message}`);
        return;
      }
    } catch (err: any) {
      setTestResult(`호출 에러: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F4F5F7', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>
        🛠 개발자 테스트 도구
      </h1>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>현재 상태</h3>
        <p>주간 완료 횟수: <b>{getWeeklyCount()}번</b></p>
        <p>보유 달란트: <b>{totalPoints}</b></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={simulate7Days}
          style={{ padding: '16px', backgroundColor: '#333D4B', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 700 }}
        >
          1. '7일 연속 달성' 강제 세팅하기
        </button>
        
        <button 
          onClick={testPromotion}
          style={{ padding: '16px', backgroundColor: '#3182F6', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 700 }}
        >
          2. 테스트 코드로 보너스(10P) 호출하기
        </button>
      </div>

      {testResult && (
        <div style={{ backgroundColor: '#191F28', color: '#00FF00', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '24px' }}>
          {testResult}
        </div>
      )}

      <button 
        onClick={() => navigate('/home')}
        style={{ width: '100%', padding: '16px', backgroundColor: '#F2F4F6', color: '#4E5968', borderRadius: '8px', border: 'none', fontWeight: 700 }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default DevToolsPage;
