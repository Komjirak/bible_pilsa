# 디자인 명세서 — 말씀필사 (Bible-Pilsa)

> 문서 버전: v1.0
> 작성일: 2026년 3월 6일
> 작성 주체: DESIGN AGENT (STAGE 2)
> 참조 문서: `prd.md`, `business-logic.md`, `apps-in-toss-guide.md`

---

## 1. 디자인 컨셉

### 핵심 방향

> "디지털 시대의 경건한 손글씨"

말씀필사는 전통적인 필사(筆寫)의 경건하고 정적인 분위기를 토스 디자인 시스템의 모던한 UI 언어로 재해석한 서비스다.
40~60대 기독교인이 매일 아침 큐티 시간에 사용하는 앱이므로, **집중을 방해하지 않는 단정함**과 **성경 말씀이 돋보이는 가독성**이 핵심이다.

### 톤 & 무드

| 속성 | 방향 |
|------|------|
| 분위기 | 고요하고 경건한 (Calm & Sacred) |
| 스타일 | 미니멀리즘 + 타이포그래피 중심 |
| 감성 | 손글씨 노트 위에 펜을 올려둔 순간 |
| 타겟 감성 | 40~60대가 선호하는 단정하고 클래식한 품격 |
| 모드 | 기본 다크 모드, 라이트 모드 전환 가능 |

### 키 비주얼 컨셉

- **어두운 배경(다크 모드)** 위에 성경 말씀이 연한 회색으로 떠오르고, 사용자의 타이핑이 밝은 흰색으로 덮어씌워지는 시각적 경험
- 단순한 배경 — 텍스처 없는 단색 배경으로 말씀 텍스트에 집중
- 시리프(Serif) 계열 폰트를 말씀 텍스트에만 적용하여 성경책의 전통적 느낌 부여
- 전체 UI(네비게이션, 버튼, 라벨 등)는 TDS Sans(Pretendard 기반) 계열로 토스 생태계 일관성 유지

---

## 2. 컬러 시스템

TDS(Toss Design System) 컬러 토큰을 기반으로 다크/라이트 모드 이중 대응한다.
`bridgeColorMode: 'basic'` 설정으로 토스 앱의 시스템 다크 모드를 자동 연동한다.

### 2-1. Primary 컬러

| 토큰 | 라이트 HEX | 다크 HEX | 용도 |
|------|-----------|---------|------|
| `--color-primary` | `#3182F6` | `#5A9FFF` | CTA 버튼, 프로그레스 바, 포인트 강조, 달력 완료 체크 |
| `--color-primary-pressed` | `#1B64DA` | `#3B82E0` | 버튼 눌림 상태 |
| `--color-primary-subtle` | `#EBF3FF` | `#1A2F4A` | 배경 강조 영역 (주간 완료 카드 배경 등) |

### 2-2. 배경(Background) 컬러

| 토큰 | 라이트 HEX | 다크 HEX | 용도 |
|------|-----------|---------|------|
| `--color-bg-primary` | `#FFFFFF` | `#131516` | 앱 전체 기본 배경 |
| `--color-bg-secondary` | `#F9FAFB` | `#1E2122` | 카드, 섹션 배경 |
| `--color-bg-tertiary` | `#F2F4F6` | `#262C2E` | 필사 화면 배경, 비활성 영역 |
| `--color-bg-overlay` | `rgba(0,0,0,0.6)` | `rgba(0,0,0,0.75)` | 모달 오버레이 |

### 2-3. 텍스트 컬러

| 토큰 | 라이트 HEX | 다크 HEX | 용도 |
|------|-----------|---------|------|
| `--color-text-primary` | `#191919` | `#F5F5F5` | 정확 입력 글자 (덮어씌운 글자), 본문 |
| `--color-text-secondary` | `#4E5968` | `#8B95A1` | 부제, 설명 텍스트 |
| `--color-text-tertiary` | `#8B95A1` | `#5E6876` | 힌트, 보조 정보 |
| `--color-text-disabled` | `#C2C9D1` | `#3E4750` | 비활성 텍스트 |
| `--color-text-placeholder` | `rgba(0,0,0,0.15)` | `rgba(255,255,255,0.18)` | 원문 말씀 (흐린 가이드 텍스트) |

> **필사 화면 핵심 컬러 규칙**
> - 원문 가이드 글자: `rgba(0,0,0,0.15)` (라이트) / `rgba(255,255,255,0.18)` (다크) — 연한 회색
> - 정확 입력 글자: `#191919` (라이트) / `#F5F5F5` (다크) — 진한 색으로 덮어씌움
> - 오타 글자: `#FF3B30` (라이트/다크 공통) — 애플 iOS 레드 계열

### 2-4. 시맨틱(Semantic) 컬러

| 토큰 | HEX | 용도 |
|------|-----|------|
| `--color-semantic-error` | `#FF3B30` | 오타 표시, 에러 메시지 |
| `--color-semantic-success` | `#34C759` | 완료 체크, 주간 완주 뱃지 |
| `--color-semantic-warning` | `#FF9500` | 포인트 지급 지연 안내 |
| `--color-semantic-info` | `#5AC8FA` | 안내 메시지, 툴팁 |

### 2-5. 보더(Border) & 디바이더

| 토큰 | 라이트 HEX | 다크 HEX | 용도 |
|------|-----------|---------|------|
| `--color-border-default` | `#E5E8EB` | `#2C3137` | 카드 테두리, 구분선 |
| `--color-border-strong` | `#B0B8C1` | `#444C55` | 강조 구분선 |

---

## 3. 타이포그래피

### 3-1. 폰트 패밀리

| 역할 | 폰트 | 적용 범위 |
|------|------|---------|
| **UI 기본** | Pretendard (TDS Sans 계열) | 버튼, 라벨, 네비게이션, 설명 텍스트, 숫자, 날짜 |
| **말씀 텍스트** | Noto Serif KR (시리프 계열) | 필사 화면의 원문 말씀, 홈 화면 오늘의 말씀 카드 본문 |

> Noto Serif KR은 성경책의 전통적 인쇄 느낌을 재현하면서도 한글 가독성이 우수하다.
> 40~60대 타겟이 익숙한 신문/책 활자 느낌을 제공한다.

### 3-2. 타입 스케일

| 레벨 | 사용 컨텍스트 | 폰트 크기 | 행간(Line Height) | 자간 | 굵기 |
|------|-------------|---------|-----------------|------|------|
| `display-1` | 필사 화면 말씀 텍스트 (가이드/입력) | 30sp | 1.7 (51px) | -0.3px | Regular (400) |
| `display-2` | 홈 오늘의 말씀 카드 본문 | 22sp | 1.6 (35px) | -0.2px | Regular (400) |
| `heading-1` | 화면 타이틀 | 22sp | 1.4 (31px) | -0.5px | Bold (700) |
| `heading-2` | 섹션 타이틀, 카드 제목 | 18sp | 1.4 (25px) | -0.3px | SemiBold (600) |
| `body-1` | 본문, 설명 | 16sp | 1.5 (24px) | -0.2px | Regular (400) |
| `body-2` | 부연 설명, 보조 정보 | 14sp | 1.5 (21px) | 0px | Regular (400) |
| `caption` | 날짜, 출처 표기, 힌트 | 12sp | 1.4 (17px) | 0px | Regular (400) |
| `label` | 버튼 텍스트, 뱃지 | 16sp | 1.0 (16px) | -0.2px | SemiBold (600) |

> 40~60대 가독성 고려 원칙: 본문 최소 16sp, 필사 텍스트 30sp로 대형 표시.
> 버튼 터치 영역 최소 44×44dp 보장.

### 3-3. 필사 화면 타이포그래피 상세

```
폰트: Noto Serif KR, Regular 400
크기: 30sp
행간: 1.7 (약 51px)
자간: -0.3px
정렬: 왼쪽 정렬 (Left-aligned)
여백(좌우): 24dp
단어 단위 줄바꿈: word-break: keep-all

가이드 레이어 색상: rgba(0,0,0,0.15) / rgba(255,255,255,0.18)
입력 레이어 색상: #191919 / #F5F5F5 (다크)
오타 레이어 색상: #FF3B30
```

---

## 4. 컴포넌트 목록

### 4-1. 글로벌 컴포넌트

| 컴포넌트 | 설명 | TDS 기반 여부 |
|---------|------|------------|
| `AppNavBar` | 앱인토스 공통 내비게이션 바 (뒤로가기, 타이틀, 고객센터) | TDS 자동 제공 |
| `BottomSafeArea` | iOS 홈 인디케이터 영역 여백 | TDS 대응 |
| `CopyrightFooter` | "성경 번역 출처: 대한성서공회 개역한글판" 상시 표기 | 커스텀 |
| `DarkModeProvider` | 토스 앱 다크 모드 연동 컨텍스트 | TDS 연동 |

### 4-2. 홈 화면 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `TodayVerseCard` | 오늘의 말씀 카드 — 책/장/절 정보, 말씀 본문(Noto Serif), 날짜 |
| `WeeklyCalendarStrip` | 이번 주 7일 달력 — 요일(월~일), 완료/미완료 원형 인디케이터 |
| `WeeklyProgressBadge` | "이번 주 N/7일 완료" 뱃지 텍스트 |
| `CTAButton` | "지금 필사하기" 대형 CTA 버튼 (Primary Blue, 높이 56dp) |
| `AlreadyDoneCard` | 오늘 이미 완료한 경우 표시 상태 카드 + 내일 카운트다운 |

### 4-3. 필사 화면 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `ProgressBar` | 상단 필사 진행률 프로그레스 바 (0~100%, Primary Blue) |
| `VerseHeader` | 책/장/절 정보 표시 상단 레이블 (body-2 크기) |
| `OverlayTextCanvas` | 핵심 컴포넌트 — 가이드 글자/입력 글자/오타 글자 레이어 렌더링 |
| `KeyboardTriggerArea` | 화면 탭 시 키보드를 올리는 투명 인터랙션 영역 |
| `HiddenTextInput` | 실제 키보드 입력을 받는 hidden input (화면에 보이지 않음) |
| `CompletionButton` | "완료" 버튼 — 텍스트 입력 시작 후 활성화 |
| `SimilarityResultToast` | 유사도 미달 시 "조금 더 정확하게 입력해주세요" 토스트 |

### 4-4. 완료 화면 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `CompletionAnimation` | 완료 축하 애니메이션 (체크마크 + 파티클 효과, Lottie) |
| `TodayVerseResultCard` | 오늘 필사한 말씀 요약 카드 |
| `WeeklyProgressCard` | "이번 주 N/7일 완료" 진행 현황 카드 |
| `WeeklyCompleteModal` | 7일 완주 시 팝업 모달 — "축하해요! 토스 포인트 10원 적립" |
| `AdContainer` | 전면 광고 영역 컨테이너 (IAA SDK 연동) |
| `ActionButtons` | "다음에 또 필사하기" / "포인트 확인하기" 버튼 그룹 |

### 4-5. 포인트 현황 화면 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `TotalPointBanner` | 누적 포인트 합계 대형 표시 배너 |
| `WeeklyCompleteStatus` | 이번 주 7일 달력 + 완주 여부 표시 |
| `CompletionHistoryList` | 과거 완주 이력 목록 (주차별, 최대 12주) |
| `PointGrantedBadge` | 포인트 지급 완료 뱃지 |

### 4-6. 설정 화면 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `NotificationTimePicker` | 매일 알림 시간 설정 (시/분 피커 또는 시간대 선택) |
| `FontSizeAdjuster` | 필사 화면 글자 크기 조절 슬라이더 (소/중/대 3단계) |
| `SettingListItem` | 설정 항목 행 (아이콘 + 라벨 + 화살표) |
| `PrivacyPolicyLink` | 개인정보처리방침 링크 항목 |
| `AppVersionInfo` | 앱 버전 정보 표시 |

---

## 5. 화면 목록

### 5-1. 홈 화면 (Home)

**화면 목적**: 오늘의 말씀 확인 + 주간 진행률 파악 + 필사 시작 유도

**레이아웃 구성**:
```
[상단] AppNavBar — "말씀필사" 타이틀
[섹션 1] TodayVerseCard
  - 상단: "오늘의 말씀" 라벨 (caption) + 날짜
  - 중앙: 말씀 본문 — Noto Serif KR 22sp, 최대 3줄 표시 후 페이드 처리
  - 하단: 책/장/절 정보 (예: 요한복음 3장 16절)
[섹션 2] WeeklyCalendarStrip
  - 월~일 요일 텍스트 (caption)
  - 각 요일 아래 원형 인디케이터 (완료: Primary Blue 채움, 미완료: 빈 원, 오늘: 파란 테두리)
  - WeeklyProgressBadge: "이번 주 5/7일 완료" 텍스트
[하단] CTAButton — "지금 필사하기" (Primary Blue, 높이 56dp)
[최하단] CopyrightFooter (caption, tertiary 색상)
```

**상태별 분기**:
- 오늘 미완료: 정상 홈 화면
- 오늘 완료: CTAButton 대신 `AlreadyDoneCard` ("오늘 말씀 완료! 내일 다시 만나요" + 카운트다운)

---

### 5-2. 필사 화면 (Writing) ★ 핵심

**화면 목적**: 오버레이 필사 UX — 원문 위에 덮어쓰는 방식으로 말씀 필사

**레이아웃 구성**:
```
[최상단] ProgressBar (높이 4dp, 화면 전체 너비, Primary Blue)
[상단] VerseHeader — "요한복음 3장 16절" (body-2, secondary)
[중앙 — 전체 화면] OverlayTextCanvas
  - 레이어 1 (가이드): 원문 말씀 전체 — 연한 회색(rgba 0.15) + Noto Serif 30sp
  - 레이어 2 (입력): 사용자가 입력한 글자 — 정확하면 #191919 진하게 덮어씌움
  - 레이어 3 (오타): 오타 글자 — #FF3B30 빨간색으로 즉시 표시
  * 글자 단위 렌더링: 원문의 i번째 글자 위치에 사용자 입력 i번째 글자를 absolute 위치로 겹침
[하단] CompletionButton — "완료" (텍스트 입력 시작 전: 비활성, 이후: 활성화)
[불가시] HiddenTextInput — 포커스 유지, 실제 입력 처리
[최하단] CopyrightFooter
```

**인터랙션 상세**:
- 화면 로드 시 자동으로 HiddenTextInput에 포커스 → 키보드 자동 표시
- 화면 어디든 탭 → 키보드 재표시 (포커스 복구)
- 백스페이스: 마지막 입력 글자 삭제
- 붙여넣기(paste): 이벤트 차단 + fraudSignals.pasteAttempts++ 기록
- 정확 입력: 해당 글자 위치의 가이드 레이어 글자 투명도 0으로 전환 + 입력 레이어에 #191919
- 오타 입력: 해당 글자 위치에 빨간색(#FF3B30) 표시 + 진동 햅틱(선택)
- 완료 버튼 → SimilarityResultToast (미달 시) 또는 완료 화면 전환 (통과 시)

**키보드 레이아웃 대응**:
- iOS/Android 키보드 높이만큼 `OverlayTextCanvas` 영역이 위로 스크롤 (KeyboardAwareScrollView 패턴)
- 현재 커서 위치(입력 중인 줄)가 키보드 위 가시 영역 중앙에 오도록 자동 스크롤

---

### 5-3. 완료 화면 (Completion)

**화면 목적**: 필사 완료 축하 + 광고 노출 + 주간 진행 현황 확인

**레이아웃 구성**:
```
[상단] AppNavBar (뒤로가기 비활성)
[섹션 1] CompletionAnimation (Lottie, 체크마크 + 파티클)
  - "오늘 말씀 필사 완료!" 타이틀 (heading-1)
  - 오늘 필사한 구절 이름 (body-2, secondary)
[섹션 2] AdContainer (전면 광고 영역, 규격: 320×50dp 배너 또는 인터스티셜 전환)
[섹션 3] WeeklyProgressCard
  - 이번 주 달력 (미니 버전)
  - "이번 주 5/7일 완료" 진행 텍스트
[하단] ActionButtons
  - "포인트 현황 보기" (Secondary 버튼)
  - "홈으로" (Ghost 버튼)
[최하단] CopyrightFooter
```

**7일 완주 시 추가 UI**:
- `WeeklyCompleteModal` 팝업
  - "축하해요! 🎉" 타이틀 (이 화면에서만 이모지 허용 — 축하 맥락)
  - "이번 주 말씀필사 완주! 토스 포인트 10원이 적립됩니다." 본문
  - "확인" 버튼 → 모달 닫힘
  - 모달 배경: 반투명 오버레이 + 포인트 적립 Lottie 애니메이션

---

### 5-4. 포인트 현황 화면 (Points)

**화면 목적**: 누적 포인트 및 완주 이력 확인

**레이아웃 구성**:
```
[상단] AppNavBar — "포인트 현황" 타이틀
[섹션 1] TotalPointBanner
  - "지금까지 모은 포인트" 라벨 (caption)
  - 총 포인트 (예: "50원") — display 스케일, Primary Blue
  - "7일 완주 N회 달성" 부제 (body-2, secondary)
[섹션 2] WeeklyCompleteStatus
  - "이번 주 현황" 섹션 타이틀
  - 7일 달력 + 완주 여부 (완주 시 Primary Blue 뱃지)
[섹션 3] CompletionHistoryList
  - "완주 기록" 섹션 타이틀
  - 각 항목: 주차 표기 (예: 3월 첫째 주) + 완료일 7개 + 포인트 지급 상태
  - 최대 12주 표시, 이후 스크롤
[최하단] CopyrightFooter
```

---

### 5-5. 설정 화면 (Settings)

**화면 목적**: 알림, 글자 크기 설정 + 개인정보처리방침 접근

**레이아웃 구성**:
```
[상단] AppNavBar — "설정" 타이틀
[섹션 1] "알림 설정" 그룹
  - NotificationTimePicker: "매일 알림 시간" → 오전 6:00 기본값, 탭 시 피커 오픈
  - 알림 ON/OFF 토글 스위치
[섹션 2] "화면 설정" 그룹
  - FontSizeAdjuster: "글자 크기" → 소(28sp) / 중(30sp, 기본) / 대(33sp) 세그먼트 선택
  - 선택 변경 시 미리보기 텍스트 즉시 반영
[섹션 3] "서비스 정보" 그룹
  - PrivacyPolicyLink: "개인정보처리방침" → 웹뷰로 열기
  - SettingListItem: "오픈소스 라이선스"
  - AppVersionInfo: "버전 1.0.0"
[최하단] CopyrightFooter
```

---

## 6. Google Stitch 작업 지시서

> Google Stitch(AI UI 생성 도구)에 입력할 프롬프트를 화면별로 작성한다.
> 실제 Stitch 도구 조작은 담당자가 수동으로 진행한다.

---

### Stitch 공통 설정 (모든 화면에 적용)

```
Design System: Toss Design System (TDS)
Target Platform: Mobile WebView (iOS/Android)
Base Colors:
  - Primary: #3182F6
  - Background (Light): #FFFFFF
  - Background (Dark): #131516
  - Text Primary (Light): #191919
  - Text Primary (Dark): #F5F5F5
Font:
  - UI: Pretendard (Toss Sans-based)
  - Verse Text: Noto Serif KR
Minimum Touch Target: 44x44dp
Default Mode: Dark Mode
```

---

### Screen 1: 홈 화면 Stitch 프롬프트

```
Create a mobile home screen for a Bible transcription app called "말씀필사".

Layout (top to bottom):
1. Navigation bar with title "말씀필사" centered, no back button
2. Today's verse card (rounded corners 16dp):
   - Small label: "오늘의 말씀" with today's date
   - Bible verse text in Noto Serif KR, 22sp, 2-3 lines max with gradient fade
   - Book/chapter/verse reference: "요한복음 3장 16절" in secondary text
3. Weekly calendar strip:
   - 7 days row: Mon-Sun labels + circular indicators
   - Completed days: filled Primary Blue circles with check marks
   - Today: outlined Primary Blue circle
   - Progress text: "이번 주 5/7일 완료"
4. Large CTA button "지금 필사하기" 56dp height, full width, Primary Blue
5. Footer text: "성경 번역 출처: 대한성서공회 개역한글판"

Style: Clean, minimal, premium. Dark mode default.
```

---

### Screen 2: 필사 화면 Stitch 프롬프트

```
Create the core transcription screen for "말씀필사" Bible app.

This is the most important screen — an overlay transcription UI.

Layout (top to bottom):
1. Thin progress bar (4dp height) at top showing completion 0-100% in Primary Blue
2. Verse reference label: "요한복음 3장 16절" small, secondary color
3. Full-screen text area (main content):
   - BACKGROUND/GUIDE LAYER: Full Bible verse text in Noto Serif KR 30sp,
     very light gray color (rgba 0,0,0,0.15 on light / rgba 255,255,255,0.18 on dark),
     displayed as guide text
   - USER INPUT OVERLAY: Each typed character overlays on top of the guide character
     at the exact same position
   - Correct characters: Dark/primary text color (#191919 light / #F5F5F5 dark)
     completely covering the guide character
   - Incorrect characters: Red (#FF3B30) immediately shown at that character position
   - No separate input field visible — the canvas IS the input
4. "완료" button at bottom, initially disabled, becomes active after typing starts

Key UX note: Keyboard appears automatically on screen load. Tapping screen refocuses.
Style: Focused, distraction-free. The verse text is the hero element.
```

---

### Screen 3: 완료 화면 Stitch 프롬프트

```
Create a completion/celebration screen for "말씀필사" Bible app.

Layout:
1. Navigation bar (no back button)
2. Large celebration animation area:
   - Checkmark icon with subtle celebration effect
   - Title: "오늘 말씀 필사 완료!" in heading-1 size, bold
   - Subtitle: completed verse reference in secondary text
3. Advertisement banner area (clearly marked as 광고, banner size)
4. Weekly progress card:
   - Title: "이번 주 진행 현황"
   - 7-day mini calendar showing current week completion status
   - Progress text: "이번 주 5/7일 완료"
5. Two action buttons:
   - Primary: "포인트 현황 보기"
   - Ghost/Secondary: "홈으로"

Also design a modal overlay for 7-day completion:
- Title: "이번 주 완주!"
- Body: "토스 포인트 10원이 적립됩니다."
- CTA button: "확인"
- Background: semi-transparent overlay
```

---

### Screen 4: 포인트 현황 화면 Stitch 프롬프트

```
Create a points/reward history screen for "말씀필사" Bible app.

Layout:
1. Navigation bar with title "포인트 현황"
2. Total points banner:
   - Small label: "지금까지 모은 포인트"
   - Large number display: "50원" in Primary Blue, display scale font
   - Subtitle: "7일 완주 5회 달성"
3. This week status section:
   - Section title: "이번 주 현황"
   - 7-day calendar strip with completion status
   - Completion badge if 7/7 completed
4. Completion history list:
   - Section title: "완주 기록"
   - List items: week label + 7 day indicators + point status badge
   - Show 12 weeks maximum, scrollable

Style: Clean data display, achievement-oriented feel.
```

---

### Screen 5: 설정 화면 Stitch 프롬프트

```
Create a settings screen for "말씀필사" Bible app.

Layout:
1. Navigation bar with title "설정"
2. "알림 설정" section:
   - List item: "매일 알림 시간" with time value "오전 6:00" and arrow icon
   - Toggle switch: "알림 켜기/끄기" with ON/OFF state
3. "화면 설정" section:
   - "글자 크기" setting with segment picker: 소 / 중(selected) / 대
   - Preview text below showing how verse text looks at selected size
4. "서비스 정보" section:
   - List item: "개인정보처리방침" with external link icon
   - List item: "오픈소스 라이선스" with arrow
   - "버전 1.0.0" text (no interaction)

Style: Standard iOS/Android settings style, TDS list components.
```

---

## 7. Figma 작업 지시서

> 실제 Figma 도구 조작은 담당자가 수동으로 진행한다.
> 아래는 Figma 파일 구조 및 작업 방식 가이드다.

### 7-1. Figma 파일 구조

```
말씀필사 (BiblePilsa) Design
├── 📁 0. Cover
│   └── 프로젝트 커버 페이지
├── 📁 1. Design System
│   ├── Colors (라이트/다크 토큰 모두 포함)
│   ├── Typography (Pretendard + Noto Serif KR 스케일)
│   ├── Icons (앱에서 사용하는 아이콘 세트)
│   └── Components (재사용 컴포넌트 라이브러리)
│       ├── Buttons (CTA, Secondary, Ghost, Disabled)
│       ├── Cards (TodayVerseCard, WeeklyProgressCard)
│       ├── Calendar (WeeklyCalendarStrip, DayIndicator)
│       ├── Lists (SettingListItem, HistoryListItem)
│       ├── Overlays (Modal, Toast, ProgressBar)
│       └── Navigation (AppNavBar, BottomSafeArea)
├── 📁 2. Screens - Light Mode
│   ├── 01_Home
│   ├── 02_Writing (Empty State / In Progress / Error State)
│   ├── 03_Completion (Normal / Weekly Complete Modal)
│   ├── 04_Points
│   └── 05_Settings
├── 📁 3. Screens - Dark Mode
│   └── (라이트 모드와 동일 구조, 다크 컬러 적용)
├── 📁 4. Prototype Flow
│   └── 전체 사용자 플로우 프로토타입 연결
├── 📁 5. Assets
│   ├── App Icons (600×600, 1000×1000)
│   ├── Thumbnails (1932×828)
│   ├── Screenshots (636×1048, 1504×741)
│   ├── OG Tag Image (1200×630)
│   └── Favicon (32×32)
└── 📁 6. Handoff
    └── 개발 전달용 스펙 주석 포함 화면
```

### 7-2. 컴포넌트 작성 규칙

1. **Auto Layout 적용**: 모든 컴포넌트는 Figma Auto Layout 기반으로 제작 (반응형 대응)
2. **컬러 스타일**: 모든 색상을 Design Token으로 등록 (라이트/다크 각각 등록)
3. **텍스트 스타일**: display-1 ~ caption 각 레벨을 Text Style로 등록
4. **컴포넌트 Variant**: Disabled, Hover, Pressed, Dark/Light 모드를 Variant로 정의
5. **그리드**: 390px 기준 24dp 좌우 마진, 컬럼 그리드 사용

### 7-3. 화면 제작 우선순위

| 우선순위 | 화면 | 이유 |
|---------|------|------|
| 1 | 필사 화면 (Writing) | 핵심 UX — 오버레이 필사 인터랙션 검증 필요 |
| 2 | 홈 화면 (Home) | 스토어 스크린샷 + 스플래시 배너의 주요 소재 |
| 3 | 완료 화면 (Completion) | 주간 완주 모달 포함, 핵심 보상 화면 |
| 4 | 포인트 현황 (Points) | 리텐션 화면 |
| 5 | 설정 (Settings) | 표준 설정 UI |

### 7-4. 에셋 제작 사양 (Figma Export 설정)

| 에셋 | Figma 프레임 크기 | Export 설정 |
|------|----------------|------------|
| 앱 로고 (소) | 600×600px | PNG @1x, 배경 레이어 포함 |
| 앱 로고 (대) | 1000×1000px | PNG @1x, 배경 레이어 포함 |
| 스플래시 배너 | 1932×828px | PNG @1x |
| 세로 스크린샷 | 636×1048px | PNG @1x, 최소 3장 |
| 가로 스크린샷 | 1504×741px | PNG @1x, 최소 1장 |
| OG Tag | 1200×630px | PNG @1x |
| Favicon | 32×32px | PNG @1x |

---

*문서 끝*
