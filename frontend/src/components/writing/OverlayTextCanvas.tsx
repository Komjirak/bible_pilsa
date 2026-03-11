import React, { useEffect, useRef } from 'react';
import { hapticError } from '@/lib/toss-bridge';
import { getCharCorrectness } from '@/lib/similarity';

interface OverlayTextCanvasProps {
  originalText: string;
  inputText: string;
  onInputChange: (text: string) => void;
  onPasteAttempt: () => void;
  fontSize?: number;
}

export function OverlayTextCanvas({
  originalText,
  inputText,
  onInputChange,
  onPasteAttempt,
  fontSize = 30,
}: OverlayTextCanvasProps) {
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const correctness = getCharCorrectness(inputText, originalText);

  const cursorRef = useRef<HTMLSpanElement>(null);

  // 마운트 시 자동 포커스
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  // 현재 입력 위치가 변경될 때마다 자동 스크롤
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [inputText]);

  const handleTap = () => {
    hiddenInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      onInputChange(inputText.slice(0, -1));
      e.preventDefault();
      return;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // 원문 길이 초과 방지
    if (newValue.length > originalText.length) return;

    const lastChar = newValue[newValue.length - 1];
    const expectedChar = originalText[newValue.length - 1];
    if (lastChar && lastChar !== expectedChar) {
      hapticError();
    }

    onInputChange(newValue);
    // hidden textarea 값을 동기화
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = newValue;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    onPasteAttempt();
  };

  const canvasStyle: React.CSSProperties = {
    position: 'relative',
    padding: '24px 24px 120px 24px', // 하단 여백 충분히 확보 (키보드 대응)
    flex: 1,
    cursor: 'text',
    wordBreak: 'keep-all',
    fontFamily: 'var(--font-ui)',
    fontSize: `${fontSize}px`,
    lineHeight: 1.8,
    letterSpacing: '-0.3px',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    backgroundColor: 'var(--color-bg-primary)',
    overflowY: 'auto', // 캔버스 영역 자체에 스크롤 허용
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'fixed', // absolute에서 fixed로 변경하여 스크롤 영향 최소화
    opacity: 0,
    width: 1,
    height: 1,
    bottom: 0,
    left: 0,
  };

  return (
    <div
      style={canvasStyle}
      onClick={handleTap}
      role="textbox"
      aria-label="필사 입력 영역"
    >
      {/* 숨겨진 실제 입력 영역 */}
      <textarea
        ref={hiddenInputRef}
        style={hiddenInputStyle}
        value={inputText}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-hidden="true"
      />

      {/* 글자별 오버레이 렌더링 */}
      <span style={{ position: 'relative' }}>
        {originalText.split('').map((char, idx) => {
          const isTyped = idx < inputText.length;
          const isCurrent = idx === inputText.length;
          const isCorrect = isTyped && correctness[idx];
          const isError = isTyped && !correctness[idx];

          let color: string;
          let fontWeight: number | undefined;
          let textDecoration: string | undefined;
          let textDecorationColor: string | undefined;

          if (isCorrect) {
            color = 'var(--color-text-primary)';
            fontWeight = 600;
          } else if (isError) {
            // 빨간색 + 진한 밑줄로 오타 강조
            color = '#F04452';
            fontWeight = 700;
            textDecoration = 'underline';
            textDecorationColor = '#F04452';
          } else {
            // 가이드 글자 (미입력) — 연한 회색
            color = 'var(--color-text-placeholder)';
            fontWeight = 400;
          }

          return (
            <span
              key={idx}
              ref={isCurrent ? cursorRef : null}
              style={{
                color,
                fontWeight,
                textDecoration,
                textDecorationColor,
                textUnderlineOffset: '3px',
                position: 'relative',
                transition: 'color 0.1s ease',
              }}
            >
              {isError ? (inputText[idx] || char) : char}
              
              {/* 현재 입력 위치에 커서 표시 */}
              {isCurrent && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '0.2em',
                  width: '2px',
                  height: '1em',
                  backgroundColor: 'var(--color-primary)',
                  animation: 'blink 1s step-end infinite'
                }} />
              )}
            </span>
          );
        })}
        
        {/* 모든 텍스트 완료 후 커서 */}
        {inputText.length === originalText.length && (
          <span ref={cursorRef} style={{ marginLeft: '1px' }} />
        )}
      </span>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
