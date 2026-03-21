import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { BannerAd } from '../components/BannerAd';

// 프로모션 코드 (앱인토스 콘솔에서 발급)
const PROMOTION_CODE = '01KKBXJR87B4GAEVGGTK81Y3CA';
const REWARD_AMOUNT = 1; // 필사 1회당 1 토스 포인트

const CompletionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'random';
  const { completeToday, advanceSequential, isTodayCompleted } = useProgressStore();

  const [rewardStatus, setRewardStatus] = useState<'pending' | 'success' | 'failed' | 'already' | 'extra'>('pending');
  const [rewardMessage, setRewardMessage] = useState('');
  const hasGranted = useRef(false); // 중복 호출 방어
  const wasAlreadyDoneRef = useRef(isTodayCompleted()); // 진입 시점에 이미 완료했었는지 기억

  useEffect(() => {
    if (hasGranted.current) return;
    hasGranted.current = true;

    // 1. 로컬 진행 상태 업데이트 (출석 관리)
    const isFirstTimeToday = !wasAlreadyDoneRef.current;
    if (isFirstTimeToday) {
      completeToday();
    }
    
    // 순서대로 모드일 경우 당일 완료 여부와 무관하게 무조건 다음 절로 이동
    if (mode === 'sequential') {
      advanceSequential();
    }

    // 2. 토스 프로모션 포인트 지급 (달란트 적립)
    if (isFirstTimeToday) {
      grantTossPoint();
    } else {
      // 오늘 이미 완료한 상태에서 추가 필사한 경우
      setRewardStatus('extra');
      setRewardMessage('추가 필사를 완료했어요! 성경 통독을 응원해요 🏃‍♂️');
    }
  }, []);

  const grantTossPoint = async () => {
    try {
      const { grantPromotionReward } = await import('@apps-in-toss/web-framework');

      const result = await grantPromotionReward({
        params: {
          promotionCode: PROMOTION_CODE,
          amount: REWARD_AMOUNT,
        },
      });

      // 결과 처리 (공식 가이드 패턴)
      if (!result) {
        // 지원하지 않는 앱 버전
        console.warn('grantPromotionReward: 지원하지 않는 앱 버전이에요.');
        setRewardStatus('failed');
        setRewardMessage('앱 업데이트가 필요해요.');
        return;
      }

      if (result === 'ERROR') {
        console.error('grantPromotionReward: 알 수 없는 오류');
        setRewardStatus('failed');
        setRewardMessage('달란트 지급 중 오류가 발생했어요.');
        return;
      }

      if ('key' in result) {
        // 성공!
        console.log('프로모션 포인트 지급 성공! key:', result.key);
        setRewardStatus('success');
        setRewardMessage(`${REWARD_AMOUNT} 달란트가 적립되었어요!`);
        return;
      }

      if ('errorCode' in result) {
        console.error('프로모션 지급 실패:', result.errorCode, result.message);

        // 에러 코드별 사용자 메시지
        switch (result.errorCode) {
          case '4110':
            setRewardStatus('already');
            setRewardMessage('이미 달란트를 받으셨어요.');
            break;
          case '4109':
            setRewardStatus('failed');
            setRewardMessage('달란트 예산이 소진되었어요.');
            break;
          case '4111':
            setRewardStatus('failed');
            setRewardMessage('달란트 지급 기간이 아니에요.');
            break;
          default:
            setRewardStatus('failed');
            setRewardMessage(result.message || '달란트 지급에 실패했어요.');
        }
        return;
      }
    } catch (err) {
      console.error('grantPromotionReward 호출 실패:', err);
      setRewardStatus('failed');
      setRewardMessage('달란트 지급 중 오류가 발생했어요.');
    }
  };

  const statusIcon = rewardStatus === 'success' ? '🎉' :
                     rewardStatus === 'already' ? '✅' :
                     rewardStatus === 'extra' ? '📖' :
                     rewardStatus === 'failed' ? '😢' : '⏳';

  const statusColor = rewardStatus === 'success' ? '#3182F6' :
                      rewardStatus === 'already' ? '#8B95A1' :
                      rewardStatus === 'extra' ? '#1BCA90' :
                      rewardStatus === 'failed' ? '#FF4040' : '#B0B8C1';

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
          오늘의 말씀을 훌륭하게 적으셨네요!
        </p>

        {/* 달란트 지급 결과 */}
        <div style={{
          width: '100%', marginTop: '24px', padding: '20px',
          backgroundColor: '#F8F9FA', borderRadius: '16px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '28px' }}>{statusIcon}</span>
          <p style={{
            fontSize: '15px', fontWeight: 600, color: statusColor,
            marginTop: '8px',
          }}>
            {rewardStatus === 'pending' ? '달란트 적립 중...' : rewardMessage}
          </p>
          {rewardStatus === 'success' && (
            <p style={{ fontSize: '13px', color: '#B0B8C1', marginTop: '4px' }}>
              7일 연속 완료 시 보너스 달란트!
            </p>
          )}
        </div>

        {/* 배너 광고 영역으로 대체 */}
        <div style={{ width: '100%', marginTop: '24px' }}>
          <BannerAd adUnitId="ait.v2.live.ae8e04b2200544f5" />
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
