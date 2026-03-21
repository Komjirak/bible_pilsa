import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BannerAd } from '../components/BannerAd';
import { getSampleVerseForToday, getSampleSequentialVerse } from '../data/sampleBible';
import '../index.css';

type BibleMode = 'random' | 'sequential';

const HomePage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<BibleMode>('random');
  const [verseData, setVerseData] = useState(getSampleVerseForToday());

  useEffect(() => {
    if (mode === 'random') {
      setVerseData(getSampleVerseForToday());
    } else {
      setVerseData(getSampleSequentialVerse(0));
    }
  }, [mode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="app-nav-bar">
        <h1>말씀필사</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '24px', paddingBottom: '16px' }}>
        {/* 모드 선택 */}
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', backgroundColor: 'var(--color-bg-secondary)', 
            borderRadius: '20px', padding: '4px', gap: '4px', width: '100%'
          }}>
            <button
              style={{
                flex: 1, padding: '10px 0', borderRadius: '16px',
                backgroundColor: mode === 'random' ? 'var(--color-bg-primary)' : 'transparent',
                color: mode === 'random' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: mode === 'random' ? 700 : 500,
                boxShadow: mode === 'random' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                border: 'none', cursor: 'pointer',
              }}
              onClick={() => setMode('random')}
            >
              오늘의 말씀
            </button>
            <button
              style={{
                flex: 1, padding: '10px 0', borderRadius: '16px',
                backgroundColor: mode === 'sequential' ? 'var(--color-bg-primary)' : 'transparent',
                color: mode === 'sequential' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: mode === 'sequential' ? 700 : 500,
                boxShadow: mode === 'sequential' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                border: 'none', cursor: 'pointer',
              }}
              onClick={() => setMode('sequential')}
            >
              순서대로
            </button>
          </div>
        </div>

        {/* 데일리 말씀 카드 */}
        <div style={{ padding: '0 24px' }}>
          <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '24px', borderRadius: '24px' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              {mode === 'random' ? '오늘의 말씀' : '순서대로 필사'}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {verseData.text}
            </p>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', marginTop: '12px' }}>
              {verseData.verseRef}
            </p>
          </div>
        </div>

        {/* 스탬프 보드 */}
        <div style={{ padding: '0 24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>주간 완주 현황</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-secondary)', padding: '16px', borderRadius: '16px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} style={{ 
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: day <= 3 ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                color: day <= 3 ? 'white' : 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600
              }}>
                {day}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 24px' }}>
          <BannerAd adUnitId="ait.v2.live.65db39c0f5d24194" />
        </div>

        {/* 하단 버튼 */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 24px' }}>
          <button 
            style={{
              width: '100%', height: '56px', borderRadius: '24px', backgroundColor: 'var(--color-accent)',
              color: '#fff', fontSize: '17px', fontWeight: 600, cursor: 'pointer', border: 'none'
            }} 
            onClick={() => navigate('/writing')}
          >
            지금 필사하기
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button
              style={{
                flex: 1, height: '48px', borderRadius: '16px', border: 'none',
                backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}
              onClick={() => navigate('/points')}
            >
              달란트 현황
            </button>
            <button
              style={{
                flex: 1, height: '48px', borderRadius: '16px', border: 'none',
                backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}
              onClick={() => navigate('/settings')}
            >
              설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
