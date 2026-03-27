import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BannerAd } from '../components/BannerAd';
import { getSampleVerseForToday, getSampleSequentialVerse } from '../data/sampleBible';
import { useProgressStore } from '../store/useProgressStore';
import '../index.css';

type BibleMode = 'random' | 'sequential';

const HomePage = () => {
  const navigate = useNavigate();
  const [mode, setModeState] = useState<BibleMode>(() => {
    return (localStorage.getItem('bible_last_mode') as BibleMode) || 'random';
  });

  const setMode = (newMode: BibleMode) => {
    setModeState(newMode);
    localStorage.setItem('bible_last_mode', newMode);
  };
  const { getWeeklyCount, isTodayCompleted, sequentialIndex, getCurrentRandomOffset } = useProgressStore();
  const completedDays = getWeeklyCount();
  const todayDone = isTodayCompleted();
  const randomOffset = getCurrentRandomOffset();

  const [verseData, setVerseData] = useState(getSampleVerseForToday(randomOffset));

  useEffect(() => {
    if (mode === 'random') {
      setVerseData(getSampleVerseForToday(randomOffset));
    } else {
      setVerseData(getSampleSequentialVerse(sequentialIndex));
    }
  }, [mode, sequentialIndex, randomOffset]);

  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 순서대로 모드의 진행률 표시
  const totalVerses = 31102; // 성경 전체 절 수
  const progressPercent = ((sequentialIndex / totalVerses) * 100).toFixed(2);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: '#F4F5F7',
    }}>
      {/* 헤더 */}
      <div style={{
        textAlign: 'center', padding: '12px 20px', backgroundColor: '#fff',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', margin: 0 }}>말씀필사</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px' }}>
        {/* 모드 탭 */}
        <div style={{
          display: 'flex', backgroundColor: '#fff', borderRadius: '12px',
          padding: '4px', gap: '4px',
        }}>
          <button
            onClick={() => setMode('random')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '8px', border: 'none',
              backgroundColor: mode === 'random' ? '#F2F4F6' : 'transparent',
              color: mode === 'random' ? '#191F28' : '#B0B8C1',
              fontWeight: mode === 'random' ? 700 : 500, fontSize: '15px',
              cursor: 'pointer',
            }}
          >오늘의 말씀</button>
          <button
            onClick={() => setMode('sequential')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '8px', border: 'none',
              backgroundColor: mode === 'sequential' ? '#F2F4F6' : 'transparent',
              color: mode === 'sequential' ? '#191F28' : '#B0B8C1',
              fontWeight: mode === 'sequential' ? 700 : 500, fontSize: '15px',
              cursor: 'pointer',
            }}
          >순서대로</button>
        </div>

        {/* 말씀 카드 */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#3182F6' }}>
              {mode === 'random' ? '오늘의 말씀' : '순서대로 필사'}
            </span>
            <span style={{ fontSize: '13px', color: '#8B95A1', paddingRight: '28px' }}>
              {mode === 'random' ? dateLabel : `${progressPercent}% 완료`}
            </span>
          </div>

          {/* 북마크 */}
          <div style={{
            position: 'absolute', top: '0', right: '24px',
            width: '24px', height: '36px', backgroundColor: '#FF5050',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
          }} />

          <p style={{
            fontSize: '18px', fontWeight: 500, color: '#191F28',
            lineHeight: 1.7, margin: '0 0 16px 0', wordBreak: 'keep-all',
          }}>
            {verseData.text}
          </p>

          <p style={{ fontSize: '14px', color: '#8B95A1', margin: 0, textAlign: 'right' }}>
            {verseData.verseRef}
          </p>
        </div>

        {/* 스탬프 보드 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isCompleted = day <= completedDays;
              const isCurrent = day === completedDays + 1;
              return (
                <div key={day} style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  backgroundColor: isCompleted ? '#3182F6' : '#F2F4F6',
                  border: isCurrent ? '2px solid #3182F6' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {isCompleted && <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>✓</span>}
                  {day === 7 && !isCompleted && <span style={{ fontSize: '12px' }}>🎁</span>}
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#8B95A1', margin: 0 }}>
            이번 주 {completedDays}번 완료 (목표: 7번)
          </p>
        </div>

        {/* 필사하기 버튼 */}
        <button
          onClick={() => navigate(`/writing?mode=${mode}`)}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            backgroundColor: todayDone ? '#B0B8C1' : '#3182F6', color: '#fff',
            fontSize: '17px', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}
        >
          {todayDone ? '이어서 필사하기' : '지금 필사하기'}
        </button>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/points')}
            style={{
              flex: 1, height: '48px', borderRadius: '12px', border: 'none',
              backgroundColor: '#fff', color: '#4E5968',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >달란트 현황</button>
          <button
            onClick={() => navigate('/settings')}
            style={{
              flex: 1, height: '48px', borderRadius: '12px', border: 'none',
              backgroundColor: '#fff', color: '#4E5968',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >설정</button>
        </div>

        <BannerAd adUnitId="ait.v2.live.65db39c0f5d24194" />
      </div>
    </div>
  );
};

export default HomePage;
