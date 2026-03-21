import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const CompletionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="app-nav-bar">
        <h1>말씀필사</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 24px 24px' }}>
        
        {/* Success Icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '40px', backgroundColor: 'var(--color-primary-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px'
        }}>
          <span style={{ fontSize: '40px' }}>🙌</span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>필사를 완료했어요</h2>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
          오늘의 말씀을 훌륭하게 적으셨네요!<br />
          보상으로 <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>10 달란트</span>가 지급되었습니다.
        </p>

        {/* Ad Section Placeholder */}
        <div style={{ width: '100%', marginTop: '40px', backgroundColor: 'var(--color-bg-secondary)', padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>보너스 달란트 받기</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>광고 보고 5 달란트 더 받기</p>
            </div>
            <button style={{
              padding: '10px 16px', borderRadius: '12px', backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              +5 받기
            </button>
          </div>
        </div>

      </div>

      <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
        <button 
          style={{ width: '100%', height: '56px', borderRadius: '24px', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '17px', fontWeight: 600 }}
          onClick={() => navigate('/')}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;
