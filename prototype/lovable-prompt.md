# Lovable.dev 프롬프트 — 말씀필사 (BiblePilsa)

> 이 파일은 Lovable.dev에 그대로 붙여넣기 가능한 프롬프트입니다.
> 작성일: 2026년 3월 6일

---

## Lovable.dev 입력 프롬프트

---

Build a Korean Christian Bible transcription mini-app called **말씀필사 (BiblePilsa)** that runs inside the Toss super-app (앱인토스 platform) as a WebView mini-app.

### Service Purpose

This app helps Korean Christian users (primarily aged 40–60) develop a daily Bible transcription habit. Every day, the app presents one verse from the Korean 개역한글판 (1961 public domain) Bible. The user manually types the verse, receives a similarity check (85% threshold), and upon completion, sees their weekly progress. Completing all 7 days in a week earns the user 10 Toss Points.

---

### Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS with Toss Design System (TDS) color tokens and spacing conventions
- **State management**: Zustand (lightweight global state for user session and weekly progress)
- **Routing**: React Router v7 (SPA, hash-based for WebView compatibility)
- **Build tool**: Vite (wrapped by `ait build` for the .ait bundle)
- **Font**: Pretendard (system-ui fallback)
- **No external APIs in the prototype** — use mock data for Bible verses, user state, and weekly progress

---

### Design System & Visual Direction

Apply a **Toss-style minimal UI**:

- **Primary color**: `#3182F6` (Toss Blue)
- **Background**: `#F9FAFB` (light gray, not pure white)
- **Card background**: `#FFFFFF` with subtle `box-shadow: 0 1px 4px rgba(0,0,0,0.08)`
- **Success/complete color**: `#00C851` (green)
- **Text colors**: `#191F28` (heading), `#6B7684` (secondary), `#B0B8C1` (disabled)
- **Border radius**: `16px` for cards, `12px` for buttons
- **Typography**: Pretendard; heading `20px 700`, body `16px 400`, caption `13px 400`
- **Button**: Full-width, height `52px`, `border-radius: 12px`, primary fill `#3182F6`
- **Spacing unit**: 4px grid (padding: 20px horizontal, 16px vertical for cards)
- **Dark mode**: Support via CSS `prefers-color-scheme` — background `#1A1E27`, card `#252A34`
- Tone: calm, trustworthy, spiritually warm — not gamified or flashy

---

### Screens to Implement

#### Screen 1: 홈 (Home / Today's Verse)

**Route**: `/`

**Layout**:
- Top navigation bar: app name "말씀필사" (left), settings icon (right)
- Date display: "2026년 3월 6일 금요일" in secondary text
- Greeting: "오늘의 말씀" as section label
- **Verse card** (white card, prominent):
  - Book + Chapter + Verse reference: e.g., "요한복음 3장 16절" in `#3182F6`
  - Verse text in Korean (개역한글판): large, readable, `18px` line-height `1.8`
  - Attribution footer inside card: "성경 번역 출처: 대한성서공회 개역한글판" in caption gray
- **Weekly progress row**: 7 day circles (Mon–Sun), completed days filled with `#3182F6`, today's day highlighted with ring, incomplete days gray
  - Label: "이번 주 4 / 7일 완료"
- **CTA button**: "지금 필사하기" — primary blue, full width, fixed above bottom safe area
- If today already completed: show "오늘 완료! ✅" state with disabled button and "내일 말씀이 기다리고 있어요" message

**Mock verse data** (hardcode one example):
```
book: "요한복음", chapter: 3, verse: 16,
text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라"
```

---

#### Screen 2: 필사 (Transcription)

**Route**: `/write`

**Layout**:
- Back button (chevron-left) top left
- Section label: "필사하기"
- **Original verse display** (read-only card):
  - Slightly smaller than home card
  - Background: `#EEF4FF` (light blue tint)
  - Verse text in `#3182F6` (so user can clearly distinguish original from their input)
  - Book/chapter/verse reference below
- **Input area**:
  - Large `<textarea>`, min-height `160px`, `font-size: 18px`, `line-height: 1.8`
  - Placeholder: "여기에 말씀을 따라 입력해 주세요"
  - Paste blocked (show subtle toast: "복사/붙여넣기는 사용할 수 없어요" if attempted)
  - Character count: `{typed_length} / {original_length}` shown bottom-right of textarea
  - Border: `1.5px solid #E0E6EF`, focus: `1.5px solid #3182F6`
- **Similarity indicator** (show after user has typed at least 50% of original length):
  - Thin progress bar below textarea showing real-time similarity
  - Below 85%: gray bar; 85%+: green bar
- **Complete button**: "완료" — activates only when input length >= 80% of original length
  - On click: run similarity check, if pass → navigate to `/complete`, if fail → show inline error "조금 더 정확하게 입력해주세요 (현재 {score}%)"

---

#### Screen 3: 완료 (Completion)

**Route**: `/complete`

**Layout**:
- Center-aligned celebration area (no header nav)
- Large checkmark icon: `#00C851` circle with white checkmark, `80px`
- Headline: "오늘 말씀 필사 완료!" `22px 700`
- Subtext: "요한복음 3장 16절을 필사했어요" in secondary gray
- **Verse echo** (small card): show the completed verse text
- **Weekly progress card**:
  - "이번 주 진행 현황" label
  - 7 day row (same as home screen) — today's circle now filled green
  - Progress text: "이번 주 5 / 7일 완료" or "🎉 이번 주 완주! 토스 포인트 10원 적립"
- **Point granted banner** (show only on week completion):
  - Blue banner: "🎉 주간 완주 달성! 토스 포인트 10원이 적립되었어요"
  - Subtle confetti animation (CSS only, no heavy library)
- **Ad placeholder** (simulate post-completion ad):
  - Gray box `320px × 250px` center, text "광고 영역 (실제 서비스에서 IAA 노출)" caption
  - Skip button appears after 5 seconds (countdown timer)
- Bottom buttons:
  - "홈으로 돌아가기" (secondary outline button)
  - "공유하기" (ghost button, share icon) — on click show mock share sheet

---

#### Screen 4: 주간 현황 (Weekly Status) — Tab or Modal

**Route**: `/weekly` (accessible from home screen "주간 달력" tap)

**Layout**:
- Header: "이번 주 필사 현황"
- Full week calendar view:
  - 7 columns (Mon–Sun), each column shows:
    - Day abbreviation (월/화/수/목/금/토/일)
    - Date number
    - Status icon: ✅ completed, ⬜ not yet, 🔒 future
    - Completed days: show verse reference in tiny text below (e.g., "요 3:16")
- Stats row:
  - "이번 주 완료" `5일`, "누적 필사" `42절`, "획득 포인트" `40원`
- Past weeks: show last 4 weeks in condensed row (just 7 dots per row with completion ratio)
- Bottom: "홈으로" button

---

#### Screen 5: 포인트 현황 (Points — accessible from home)

**Route**: `/points`

**Layout**:
- Header: "포인트 현황"
- Total earned card: "지금까지 적립한 포인트" with large number `50원`
- Transaction list: each row = week range + 10원 + date
  - e.g., "3월 2일 ~ 3월 8일 완주 | +10원 | 2026.03.08"
  - Show 4~5 mock rows
- Footer note: "포인트는 토스 앱에서 확인하실 수 있어요"

---

### Additional UI Requirements

1. **Attribution footer**: Every screen (except full-screen ad placeholder) must show at the very bottom: `"성경 번역 출처: 대한성서공회 개역한글판"` in `11px` `#B0B8C1`. This is legally required.

2. **Bottom safe area**: Account for iOS home indicator (20px bottom padding on main content).

3. **Loading skeleton**: Home screen should show skeleton card while "loading" the daily verse (simulate 800ms delay with setTimeout).

4. **Toast component**: Reusable bottom toast for error messages and confirmations (e.g., "복사/붙여넣기는 사용할 수 없어요", "내일 다시 도전해보세요").

5. **Haptic feedback simulation**: On completion, trigger a brief CSS scale animation (`scale(1.05)` → `scale(1)`) on the checkmark icon to simulate haptic feedback.

6. **Mock user data** (use in Zustand store):
```typescript
const mockUser = {
  userKey: 12345678,
  weekProgress: [true, false, true, true, true, false, false], // Mon=true, etc.
  totalCompletions: 42,
  totalPointsEarned: 50,
  todayCompleted: false,
};
```

7. **Mock verse of the day**:
```typescript
const todayVerse = {
  book: "요한복음",
  chapter: 3,
  verse: 16,
  text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라",
  reference: "요한복음 3:16"
};
```

8. **Accessibility**: All interactive elements must have `aria-label` in Korean. Minimum touch target `44×44px`. Font sizes no smaller than `13px`.

---

### File Structure Suggestion

```
src/
  pages/
    Home.tsx
    Write.tsx
    Complete.tsx
    Weekly.tsx
    Points.tsx
  components/
    VerseCard.tsx
    WeekProgressBar.tsx
    TextareaInput.tsx
    SimilarityMeter.tsx
    AdPlaceholder.tsx
    Toast.tsx
    BottomAttribution.tsx
  store/
    useUserStore.ts      (Zustand)
    useVerseStore.ts     (Zustand)
  utils/
    similarity.ts        (Levenshtein distance calculator)
  data/
    todayVerse.ts        (mock verse)
  App.tsx
  main.tsx
```

---

### Similarity Utility (implement this)

```typescript
// src/utils/similarity.ts
export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[a.length][b.length];
}

export function normalize(text: string): string {
  return text
    .replace(/[.,!?·…""''()[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function similarity(input: string, original: string): number {
  const a = normalize(input);
  const b = normalize(original);
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}
```

---

Start by building the **Home screen** first, then implement Write → Complete flow. Make the app fully functional as a prototype with all mock data wired up. The design should feel like a real Toss mini-app — clean, fast, and trustworthy.

---

*이 프롬프트 끝 — Lovable.dev에 전체 내용을 붙여넣고 생성을 시작하세요.*
