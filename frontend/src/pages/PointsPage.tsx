import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const PointsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="app-nav-bar" style={{ justifyContent: 'center', padding: '0 16px', backgroundColor: 'var(--color-bg-primary)' }}>
        <h1>달란트 내역</h1>
      </div>

      <div style={{ padding: '32px 24px', backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>보유 달란트</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>1,200</h2>
          <span style={{ fontSize: '20px', fontWeight: 600 }}>달란트</span>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'var(--color-bg-primary)', marginTop: '12px', padding: '0 24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, padding: '24px 0 16px' }}>이용 내역</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>매일 필사 참여</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>오늘 오전 10:42</p>
          </div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>+10</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>7일 연속 참여 보너스</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>어제 오전 09:15</p>
          </div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>+10</p>
        </div>
      </div>
      
      {/* 바텀 네비용 홈 버튼 추가 */}
      <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-primary)', marginTop: 'auto' }}>
        <button 
          style={{ width: '100%', height: '56px', borderRadius: '24px', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', fontSize: '16px', fontWeight: 600 }}
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PointsPage;
