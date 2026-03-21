import { useNavigate } from 'react-router-dom';

const PointsPage = () => {
  const navigate = useNavigate();

  // 실제 데이터 — 현재 적립 내역 없음
  const totalPoints = 0;
  const history: { label: string; date: string; amount: number }[] = [];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: '#F4F5F7',
    }}>
      {/* 헤더 */}
      <div style={{
        textAlign: 'center', padding: '12px 16px',
        backgroundColor: '#fff', borderBottom: '1px solid #F2F4F6',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', margin: 0 }}>달란트 현황</h1>
      </div>

      {/* 보유 달란트 */}
      <div style={{ padding: '32px 24px', backgroundColor: '#fff' }}>
        <p style={{ fontSize: '14px', color: '#8B95A1', marginBottom: '8px' }}>보유 달란트</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#191F28', margin: 0 }}>
            {totalPoints.toLocaleString()}
          </h2>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#191F28' }}>달란트</span>
        </div>
      </div>

      {/* 이용 내역 */}
      <div style={{
        flex: 1, backgroundColor: '#fff', marginTop: '12px', padding: '0 24px',
      }}>
        <h3 style={{
          fontSize: '16px', fontWeight: 700, color: '#191F28',
          padding: '20px 0 16px', margin: 0,
        }}>이용 내역</h3>

        {history.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 0',
            color: '#B0B8C1', fontSize: '15px',
          }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>📭</p>
            <p>아직 적립 내역이 없습니다</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              필사를 완료하면 달란트가 적립돼요
            </p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '16px 0', borderBottom: '1px solid #F2F4F6',
            }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#191F28', marginBottom: '4px' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '13px', color: '#8B95A1' }}>{item.date}</p>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#3182F6' }}>
                +{item.amount}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 24px 20px', backgroundColor: '#fff' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%', height: '52px', borderRadius: '14px',
            backgroundColor: '#F2F4F6', color: '#4E5968',
            fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PointsPage;
