// Levenshtein Distance 기반 유사도 계산 (클라이언트 1차 검증)
// business-logic.md 섹션 3-2 기준

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 대체
          matrix[i][j - 1] + 1,     // 삽입
          matrix[i - 1][j] + 1      // 삭제
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// 전처리: 공백 정규화, 구두점 제거, 특수문자 제거
function normalize(text: string): string {
  return text
    .replace(/[.,!?·…""''()[\]]/g, '') // 구두점·괄호 제거
    .replace(/\s+/g, ' ')               // 연속 공백 → 단일 공백
    .trim();
}

// 유사도 계산 (0.0 ~ 1.0)
export function calculateSimilarity(input: string, original: string): number {
  const normalizedInput = normalize(input);
  const normalizedOriginal = normalize(original);

  if (normalizedOriginal.length === 0) return 1.0;
  if (normalizedInput.length === 0) return 0.0;

  const distance = levenshteinDistance(normalizedInput, normalizedOriginal);
  const maxLen = Math.max(normalizedInput.length, normalizedOriginal.length);

  return 1 - distance / maxLen;
}

// 통과 기준 (85%)
export const SIMILARITY_THRESHOLD = 0.85;

export function isSimilarityPassed(similarity: number): boolean {
  return similarity >= SIMILARITY_THRESHOLD;
}

// 글자별 정오 여부 배열 반환 (OverlayTextCanvas용)
export function getCharCorrectness(input: string, original: string): boolean[] {
  const result: boolean[] = [];
  for (let i = 0; i < input.length; i++) {
    result.push(i < original.length && input[i] === original[i]);
  }
  return result;
}
