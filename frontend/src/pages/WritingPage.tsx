import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFullScreenAd } from '../hooks/useFullScreenAd';
import '../index.css';

const WritingPage: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const { showAd, isAdLoaded } = useFullScreenAd();
  
  const targetText = '태초에 하나님이 천지를 창조하시니라 (창 1:1)';
  const progress = targetText.length > 0 ? text.length / targetText.length : 0;
  const isActive = text.length > 0;

  const handleSubmit = () => {
    if (text.length > 5) {
      if (isAdLoaded) {
        showAd(() => navigate('/completion'));
      } else {
        navigate('/completion');
      }
    } else {
      alert('조금 더 정확하게 입력해주세요.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-bg-primary)', overflow: 'hidden' }}>
      <div className="app-nav-bar" style={{ justifyContent: 'center', padding: '0 16px' }}>
        <h1>오늘의 필사</h1>
      </div>

      {/* 프로그레스 바 */}
      <div style={{ height: '4px', backgroundColor: 'var(--color-bg-tertiary)', width: '100%' }}>
        <div style={{
            height: '100%',
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: 'var(--color-accent)',
            transition: 'width 0.1s',
            borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* 구절 정보 */}
      <div style={{ padding: '12px 24px 8px', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
        창세기 1장 1절
      </div>

      {/* 오버레이 필사 캔버스 심플 구현 */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', flex: 1, marginTop: '16px' }}>
           {/* 원본 성경 텍스트 */}
           <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%',
              fontSize: '24px', lineHeight: 1.6, color: 'var(--color-text-placeholder)',
              pointerEvents: 'none',
              fontWeight: 500
           }}>
             {targetText.split('').map((char, idx) => (
                <span key={idx} style={{ visibility: text[idx] ? 'hidden' : 'visible' }}>{char}</span>
             ))}
           </div>
           
           {/* 유저 입력 텍스트영역 */}
           <textarea
             value={text}
             onChange={(e) => setText(e.target.value)}
             style={{
               position: 'absolute',
               top: 0, left: 0, width: '100%', height: '100%',
               fontSize: '24px', lineHeight: 1.6, color: 'var(--color-text-primary)',
               background: 'transparent', border: 'none', resize: 'none', fontWeight: 500,
               outline: 'none', padding: 0
             }}
             spellCheck={false}
           />
        </div>
      </div>

      {/* 완료 버튼 */}
      <div style={{ padding: '12px 24px 16px', backgroundColor: 'var(--color-bg-primary)' }}>
        <button
          style={{
            width: '100%', height: '52px', borderRadius: '24px',
            backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: isActive ? '#fff' : 'var(--color-text-disabled)',
            fontSize: '16px', fontWeight: 600, border: 'none', transition: 'all 0.2s',
            boxShadow: isActive ? '0 4px 16px rgba(49, 130, 246, 0.2)' : 'none',
          }}
          onClick={handleSubmit}
          disabled={!isActive}
        >
          {isAdLoaded ? '광고 보고 필사 완료 달란트 받기' : '필사 완료 달란트 받기'}
        </button>
      </div>
    </div>
  );
};

export default WritingPage;
