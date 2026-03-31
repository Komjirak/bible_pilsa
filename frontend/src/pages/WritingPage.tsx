import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFullScreenAd } from '../hooks/useFullScreenAd';
import { getSampleVerseForToday, getSampleSequentialVerse } from '../data/sampleBible';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import '../index.css';

const WritingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'random';
  const { showAd, isAdLoaded } = useFullScreenAd();
  const { sequentialIndex, getCurrentRandomOffset } = useProgressStore();
  const { fontSize } = useSettingsStore();
  const randomOffset = getCurrentRandomOffset();
  const verseData = mode === 'sequential' ? getSampleSequentialVerse(sequentialIndex) : getSampleVerseForToday(randomOffset);
  const targetText = verseData.text;
  
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const progress = targetText.length > 0 ? Math.min(text.length / targetText.length, 1) : 0;
  const isComplete = text.length >= targetText.length && text.length > 0;

  // 자동 포커스
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.length > 5) {
      if (isAdLoaded) {
        showAd(() => navigate(`/completion?mode=${mode}`));
      } else {
        navigate(`/completion?mode=${mode}`);
      }
    } else {
      alert('조금 더 정확하게 입력해주세요.');
    }
  };

  // 글자별 렌더링: 입력된 부분은 검정(정확) 또는 빨강(오타), 미입력 부분은 회색
  const renderOverlayText = () => {
    return targetText.split('').map((targetChar, idx) => {
      const inputChar = text[idx];

      if (inputChar === undefined) {
        // 아직 입력 안 된 글자 → 연한 회색
        return (
          <span key={idx} style={{ color: '#D1D6DB' }}>
            {targetChar}
          </span>
        );
      } else if (inputChar === targetChar) {
        // 정확히 맞은 글자 → 검정
        return (
          <span key={idx} style={{ color: '#191F28', fontWeight: 600 }}>
            {targetChar}
          </span>
        );
      } else {
        // 오타 → 빨간 배경 + 흰 글자
        return (
          <span key={idx} style={{
            color: '#fff', backgroundColor: '#FF4040',
            borderRadius: '3px', padding: '0 2px',
            fontWeight: 600,
          }}>
            {inputChar}
          </span>
        );
      }
    });
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'var(--screen-height, 100vh)',
      backgroundColor: '#fff', overflow: 'hidden',
    }}>
      {/* 헤더 */}
      <div style={{
        textAlign: 'center', padding: '12px 16px',
        borderBottom: '1px solid #F2F4F6',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', margin: 0 }}>
          오늘의 필사
        </h1>
      </div>

      {/* 진행률 바 */}
      <div style={{ height: '3px', backgroundColor: '#F2F4F6', width: '100%' }}>
        <div style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: '#3182F6',
          transition: 'width 0.15s ease',
        }} />
      </div>

      {/* 구절 정보 */}
      <div style={{
        padding: '12px 24px 8px', fontSize: '14px',
        color: '#8B95A1', fontWeight: 600,
      }}>
        {verseData.verseRef}
      </div>

      {/* 필사 영역 */}
      <div style={{ flex: 1, padding: '0 24px', position: 'relative', overflow: 'hidden' }}>
        {/* 오버레이 텍스트 (시각적 피드백) */}
        <div style={{
          position: 'absolute', top: 0, left: '24px', right: '24px',
          fontSize: fontSize === 'small' ? '20px' : fontSize === 'large' ? '28px' : '24px',
          lineHeight: 1.8, fontWeight: 500,
          pointerEvents: 'none', zIndex: 1,
          whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {renderOverlayText()}
        </div>

        {/* 투명 텍스트 입력 영역 */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={targetText.length}
          style={{
            position: 'absolute', top: 0, left: '24px', right: '24px',
            width: 'calc(100% - 48px)', height: '100%',
            fontFamily: 'inherit',
            fontSize: fontSize === 'small' ? '20px' : fontSize === 'large' ? '28px' : '24px',
            lineHeight: 1.8, fontWeight: 500,
            color: 'transparent', caretColor: '#3182F6',
            background: 'transparent', border: 'none', resize: 'none',
            outline: 'none', padding: 0, zIndex: 2,
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {/* 완료 버튼 */}
      <div style={{
        padding: '12px 24px 20px', backgroundColor: '#fff',
        borderTop: '1px solid #F2F4F6',
      }}>
        <button
          onClick={handleSubmit}
          disabled={text.length < 5}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            backgroundColor: isComplete ? '#3182F6' : text.length > 5 ? '#3182F6' : '#E5E8EB',
            color: text.length > 5 ? '#fff' : '#B0B8C1',
            fontSize: '16px', fontWeight: 600, border: 'none',
            cursor: text.length > 5 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {isAdLoaded ? '광고 보고 필사 완료 달란트 받기' : '필사 완료 달란트 받기'}
        </button>
      </div>
    </div>
  );
};

export default WritingPage;
