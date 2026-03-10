// 필사 화면 (Writing) — 핵심 화면
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavBar } from '@/components/global/AppNavBar';
import { CopyrightFooter } from '@/components/global/CopyrightFooter';
import { OverlayTextCanvas } from '@/components/writing/OverlayTextCanvas';
import { useDailyVerse } from '@/hooks/useDailyVerse';
import { useSequentialVerse, SEQUENTIAL_INDEX_KEY } from '@/hooks/useSequentialVerse';
import { useAuth } from '@/hooks/useAuth';
import { calculateSimilarity, isSimilarityPassed } from '@/lib/similarity';
import { submitCompletion } from '@/lib/api';
import { getTodayKST } from '@/lib/dateUtils';
import { getSavedFontSize } from '@/app/settings/page';
import { BIBLE_MODE_KEY } from '@/app/page';

const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: 'var(--color-bg-primary)',
  overflow: 'hidden',
};

const progressBarContainerStyle: React.CSSProperties = {
  height: '4px',
  backgroundColor: 'var(--color-bg-tertiary)',
  width: '100%',
};

const verseHeaderStyle: React.CSSProperties = {
  padding: '12px 24px 8px',
  fontSize: '14px',
  color: 'var(--color-text-secondary)',
  fontWeight: 600,
  fontFamily: 'var(--font-ui)',
};

const canvasAreaStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const bottomBarStyle: React.CSSProperties = {
  padding: '12px 24px 16px',
  backgroundColor: 'var(--color-bg-primary)',
};

const completeBtnStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  height: '52px',
  borderRadius: '24px',
  backgroundColor: active ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
  color: active ? '#fff' : 'var(--color-text-disabled)',
  fontSize: '16px',
  fontWeight: 600,
  cursor: active ? 'pointer' : 'default',
  border: 'none',
  transition: 'all 0.2s',
  boxShadow: active ? '0 4px 16px rgba(209, 92, 50, 0.2)' : 'none',
});

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'var(--color-primary)',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '24px',
  fontSize: '14px',
  whiteSpace: 'nowrap',
  zIndex: 500,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

export default function WritingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [mode] = useState<'random' | 'sequential'>(() => {
    return (localStorage.getItem(BIBLE_MODE_KEY) as 'random' | 'sequential') || 'random';
  });

  const { verse: dailyVerse } = useDailyVerse(isLoggedIn);
  const { verse: seqVerse } = useSequentialVerse();
  
  const verse = mode === 'random' ? dailyVerse : seqVerse;

  const [inputText, setInputText] = useState('');
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typingStartRef = useRef<Date | null>(null);

  const handleInputChange = useCallback((text: string) => {
    if (typingStartRef.current === null && text.length > 0) {
      typingStartRef.current = new Date();
    }
    setInputText(text);
  }, []);

  const handlePasteAttempt = useCallback(() => {
    setPasteAttempts((prev) => prev + 1);
    showToastMessage('복사/붙여넣기는 사용할 수 없어요.');
  }, []);

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleComplete = async () => {
    if (!verse || inputText.length === 0 || isSubmitting) return;

    const similarity = calculateSimilarity(inputText, verse.text);

    if (!isSimilarityPassed(similarity)) {
      showToastMessage('조금 더 정확하게 입력해주세요.');
      return;
    }

    const typingDurationMs = typingStartRef.current
      ? Date.now() - typingStartRef.current.getTime()
      : 0;

    setIsSubmitting(true);
    try {
      const result = await submitCompletion({
        date: getTodayKST(),
        typedText: inputText,
        typingDurationMs,
        typingStartAt: typingStartRef.current?.toISOString() ?? new Date().toISOString(),
        pasteAttempts,
        clientSimilarity: similarity,
        verseRef: `${verse.book} ${verse.chapter}장 ${verse.verse}절`,
      } as any);

      if (mode === 'sequential') {
        const currentIndex = parseInt(localStorage.getItem(SEQUENTIAL_INDEX_KEY) || '0', 10);
        localStorage.setItem(SEQUENTIAL_INDEX_KEY, (currentIndex + 1).toString());
      }

      navigate('/completion', { state: { result, verse, mode } });
    } catch {
      showToastMessage('완료 처리 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!verse) {
    return (
      <div style={pageStyle}>
        <AppNavBar title="말씀필사" showBack />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--color-text-tertiary)' }}>말씀을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const progress = verse.text.length > 0 ? inputText.length / verse.text.length : 0;
  const isActive = inputText.length > 0;

  return (
    <div style={pageStyle}>
      <AppNavBar title="오늘의 필사" showBack />

      {/* 프로그레스 바 */}
      <div style={progressBarContainerStyle}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: 'var(--color-accent)',
            transition: 'width 0.1s',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>

      {/* 구절 정보 */}
      <div style={verseHeaderStyle}>
        {verse.book} {verse.chapter}장 {verse.verse}절
      </div>

      {/* 오버레이 필사 캔버스 */}
      <div style={canvasAreaStyle}>
        <OverlayTextCanvas
          originalText={verse.text}
          inputText={inputText}
          onInputChange={handleInputChange}
          onPasteAttempt={handlePasteAttempt}
          fontSize={getSavedFontSize()}
        />
        <CopyrightFooter />
      </div>

      {/* 완료 버튼 */}
      <div style={bottomBarStyle}>
        <button
          style={completeBtnStyle(isActive && !isSubmitting)}
          onClick={handleComplete}
          disabled={!isActive || isSubmitting}
        >
          {isSubmitting ? '제출 중...' : '광고 시청하고 포인트 받기'}
        </button>
      </div>

      {/* 토스트 */}
      {showToast && <div style={toastStyle} className="animate-fade-in">{toastMessage}</div>}
    </div>
  );
}
