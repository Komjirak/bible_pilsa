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

  // 마운트 시 자동 포커스
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

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
    padding: '24px',
    flex: 1,
    cursor: 'text',
    wordBreak: 'keep-all',
    fontFamily: 'var(--font-verse)',
    fontSize: `${fontSize}px`,
    lineHeight: 1.7,
    letterSpacing: '-0.3px',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    overflow: 'hidden',
    pointerEvents: 'none',
    top: 0,
    left: 0,
  };

  return (
    <div style={canvasStyle} onClick={handleTap} role="textbox" aria-label="필사 입력 영역">
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
      <span>
        {originalText.split('').map((char, idx) => {
          const isTyped = idx < inputText.length;
          const isCorrect = isTyped && correctness[idx];
          const isError = isTyped && !correctness[idx];

          let color: string;
          let opacity = 1;

          if (isCorrect) {
            color = 'var(--color-text-primary)';
          } else if (isError) {
            color = 'var(--color-error)';
          } else {
            // 가이드 글자 (미입력)
            color = 'var(--color-text-placeholder)';
            opacity = 1;
          }

          return (
            <span
              key={idx}
              style={{
                color,
                opacity,
                position: 'relative',
                transition: 'color 0.1s',
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
}
