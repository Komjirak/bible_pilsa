# 디자인 에셋 목록 — 말씀필사 (Bible-Pilsa)

> 문서 버전: v1.0
> 작성일: 2026년 3월 6일
> 작성 주체: DESIGN AGENT (STAGE 2)
> 참조: `apps-in-toss-guide.md` 13항 "앱 등록 에셋 규격 요약"

---

## 개요

앱인토스 콘솔 등록 및 스토어 노출에 필요한 모든 에셋을 명세한다.
실제 제작은 Google Stitch(AI 생성) 또는 Figma(수동 제작)로 진행한다.

| 에셋 종류 | 총 수량 | 필수 여부 |
|---------|--------|--------|
| 앱 로고 | 2종 | 필수 |
| 스토어 썸네일 | 2종 | 필수 |
| 스크린샷 (세로형) | 4장 | 선택 (우선 노출 혜택) |
| 스크린샷 (가로형) | 1장 | 선택 (우선 노출 혜택) |
| OG Tag 이미지 | 1종 | 권장 |
| Favicon | 1종 | 권장 |

---

## 에셋 1: 앱 로고 (소) — 앱인토스 콘솔 등록용

| 항목 | 내용 |
|------|------|
| 규격 | 600 × 600 px |
| 포맷 | PNG (투명 배경 불가, 단색 배경 필수) |
| Figma 저장 위치 | `5. Assets / App Icons / app-logo-600.png` |
| 앱인토스 등록 위치 | 콘솔 > 앱 등록 > 앱 로고 |

### 디자인 방향

```
배경색: #1A1F2E (딥 네이비 — 성경책의 어두운 하드커버 느낌)
아이콘 구성:
  - 중앙: 펼쳐진 성경책 실루엣 아이콘 (단순화된 벡터)
  - 책 위: 작은 깃털 펜(Quill) 또는 붓 모양 아이콘이 비스듬히 걸쳐 있는 형태
  - 전체 느낌: 성경책 + 필사(글쓰기)의 조합을 단 2개 요소로 표현
아이콘 색상: #FFFFFF (흰색) + #5A9FFF (토스 블루 다크 계열, 강조)
여백: 아이콘이 600px 중 약 360px 영역 차지 (60%), 상하좌우 균등 여백
모서리: SVG/PNG 파일에 rx/ry 등 둥근 모서리 처리 절대 금지 — 꽉 찬 사각형으로 제출 (앱인토스 플랫폼이 자동으로 마스킹 처리)
```

### Google Stitch 생성 프롬프트

```
Design a mobile app icon for "말씀필사" (BiblePilsa), a Bible transcription app.

Specifications:
- Size: 600x600px square
- Background: Deep navy color #1A1F2E (like a hardcover Bible)
- Main icon: An open Bible book silhouette in white (#FFFFFF)
- Secondary element: A small quill pen or brush placed diagonally across the open Bible,
  in Toss Blue color (#5A9FFF)
- Style: Clean, minimal, modern — not religious cliche
- No text, no gradients, flat design
- Icon fills about 60% of the canvas, centered with equal padding on all sides
- The combination should immediately convey: "reading/writing holy scripture"
```

---

## 에셋 2: 앱 로고 (대) — 정방형 썸네일

| 항목 | 내용 |
|------|------|
| 규격 | 1000 × 1000 px |
| 포맷 | PNG (배경색 필수) |
| Figma 저장 위치 | `5. Assets / App Icons / app-logo-1000.png` |
| 앱인토스 등록 위치 | 콘솔 > 카테고리 및 노출 > 정방형 썸네일 |

### 디자인 방향

```
배경: 딥 네이비 단색 (#1A1F2E) 또는 앱 대표 화면 스크린샷 기반 합성
구성 방식 A (로고 중심):
  - 앱 로고(소)와 동일한 아이콘을 중앙에 크게 배치
  - 하단에 서비스명 "말씀필사" 텍스트 추가 (Noto Serif KR, 흰색)
구성 방식 B (화면 중심, 권장):
  - 스마트폰 목업 프레임(폰 실루엣) 위에 필사 화면 스크린샷 배치
  - 좌측 여백에 서비스명 + 한 줄 설명 오버레이
  - "하루 한 절, 말씀을 타이핑하다"
핵심 콘텐츠:
  - 서비스명 "말씀필사" 가독성 최우선
  - 필사 UX 핵심 장면 (오버레이 텍스트 화면) 노출 권장
  - 과도한 텍스트 지양 (앱인토스 가이드 준수)
```

### Google Stitch 생성 프롬프트

```
Design a 1000x1000px square thumbnail for "말씀필사" (BiblePilsa) Korean Bible app
for the Apps in Toss (Korean fintech super-app) store listing.

Content:
- Deep navy background (#1A1F2E)
- Left side: App icon (open Bible + quill pen in white and Toss Blue #5A9FFF)
- Right side or bottom: App name "말씀필사" in Noto Serif KR, large, white
- Tagline below: "하루 한 절, 말씀을 손으로 쓰다" in Pretendard, small, light gray
- Right area: Minimal phone mockup showing the transcription screen
  (gray guide text with darker overlay text — the core UX)

Style: Premium, clean, Korean fintech aesthetic. No religious symbols or crosses.
Minimal text. High contrast. Dark mode feel.
```

---

## 에셋 3: 스플래시 배너 — 가로형 썸네일

| 항목 | 내용 |
|------|------|
| 규격 | 1932 × 828 px |
| 포맷 | PNG (또는 JPG) |
| Figma 저장 위치 | `5. Assets / Thumbnails / splash-banner-1932x828.png` |
| 앱인토스 등록 위치 | 콘솔 > 카테고리 및 노출 > 가로형 썸네일 |

### 디자인 방향

```
가로 와이드 배너 — 앱인토스 스토어 카테고리 페이지 상단 노출용

레이아웃 (3분할 구조):
  [좌 1/3] 서비스 아이덴티티 영역
    - 앱 아이콘 (중간 크기, 500×500px 내외 배치)
    - 서비스명 "말씀필사" (Noto Serif KR, 대형)
    - 부제 "매일 한 절, 말씀을 타이핑하고 포인트 받기" (Pretendard, 소형)
  [중 1/3] 핵심 기능 시각화
    - 오버레이 필사 UX 화면을 투명 폰 프레임에 삽입
    - 원문 회색 텍스트 → 검정 덮어씌워진 텍스트의 before/after 느낌
  [우 1/3] 보상/혜택 강조
    - "7일 완주 → 토스 포인트 10원" 인포그래픽
    - 포인트 아이콘 (토스 포인트 로고 스타일 원형 아이콘)
    - "무료" 뱃지 (앱 자체가 무료임을 강조)

배경: 딥 네이비 단색 또는 미묘한 그라디언트 (#0F1420 → #1A2A4A)
텍스트 색상: 흰색 + 토스 블루 강조
빈 공간 처리: 블러/색상으로 채우지 않음 (앱인토스 가이드 준수) — 배경 색상으로 처리
```

### Google Stitch 생성 프롬프트

```
Design a 1932x828px wide banner (landscape/horizontal) for "말씀필사" Bible app
for the Apps in Toss store.

Layout (left to right):
Left third:
  - App icon (Bible + quill, 300px)
  - App name "말씀필사" large, Noto Serif KR, white
  - Tagline "매일 한 절, 말씀을 타이핑하고 포인트 받기" small, light gray

Center third:
  - Smartphone mockup showing the overlay transcription UI
  - Guide text (very light gray) with darker typed text overlaid on top
  - This represents the core UX of the app

Right third:
  - "7일 완주" label
  - Arrow icon pointing to
  - "토스 포인트 10원" with Toss-style coin icon
  - Emphasize simplicity of earning reward

Background: Very dark navy (#0F1420), no gradients that look tacky
Style: Korean fintech premium, clean, not religious
No excessive text, high readability at small sizes
```

---

## 에셋 4-6: 스크린샷 — 세로형 (필수 3장 + 추가 1장)

### 공통 규격

| 항목 | 내용 |
|------|------|
| 규격 | 636 × 1048 px |
| 포맷 | PNG |
| 최소 수량 | 3장 (앱인토스 우선 노출 혜택 조건) |
| Figma 저장 위치 | `5. Assets / Screenshots / vertical/` |
| 앱인토스 등록 위치 | 콘솔 > 카테고리 및 노출 > 스크린샷 |

---

### 스크린샷 1: 필사 화면 (핵심 기능 쇼케이스)

```
목적: 앱의 핵심 UX인 오버레이 필사 UI를 직접 보여줌

화면 구성:
  상단: 진행률 프로그레스 바 (50% 상태)
  구절 정보: "요한복음 3장 16절"
  중앙 (핵심): 실제 필사 장면 시뮬레이션
    - 배경 가이드 텍스트: 연한 회색 "하나님이 세상을 이처럼 사랑하사..."
    - 이미 입력된 글자들: 진한 검정/흰색으로 원문 위를 덮음 (8~10자 입력된 상태)
    - 방금 잘못 입력한 글자 1개: 빨간색 표시
  하단: "완료" 버튼 (활성화 상태)

상단 캡션 오버레이 (사진 외부, 배너 영역):
  "원문 위에 덮어 쓰는 필사" — 해당 UX 설명 한 줄

다크 모드 버전으로 제작 (배경 #131516)
```

**Figma 작업**: 필사 화면 다크 모드 스크린샷 + 636×1048 프레임에 배치
**Stitch 프롬프트**:
```
Create a 636x1048px screenshot for "말씀필사" Bible transcription app store listing.

Show the core transcription UI:
- Dark background (#131516)
- Top: thin blue progress bar at 50%
- Small text: "요한복음 3장 16절" in secondary color
- Main area: Bible verse "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니
  이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라"
  displayed in large Noto Serif font (30sp)
- GUIDE LAYER: Full verse in very light gray (rgba white 0.18)
- USER INPUT OVERLAY: First 10 characters already typed in bright white
  covering the guide text (like the guide text disappears as you type)
- One character showing in red (#FF3B30) indicating a typo
- Bottom: "완료" button (blue, active state)

Caption bar above: "원문 위에 덮어 쓰는 필사" in white text on blue bar
```

---

### 스크린샷 2: 홈 화면 (서비스 개요)

```
목적: 오늘의 말씀 카드 + 주간 달력으로 서비스 전체 구조를 한눈에 보여줌

화면 구성:
  네비게이션: "말씀필사" 타이틀
  오늘의 말씀 카드:
    - "오늘의 말씀" 라벨 + 날짜
    - 말씀 텍스트: "하나님이 세상을 이처럼 사랑하사..."
    - 출처: "요한복음 3장 16절"
  주간 달력: 월~일, 월화수목 완료(파란 원), 금토일 미완료(빈 원)
  "이번 주 4/7일 완료" 진행 텍스트
  "지금 필사하기" CTA 버튼 (파란색, 하단 고정)

상단 캡션 오버레이:
  "매일 한 절, 7일 완주하면 포인트"

다크 모드 버전으로 제작
```

**Figma 작업**: 홈 화면 다크 모드 스크린샷 + 636×1048 프레임 배치

---

### 스크린샷 3: 주간 완주 완료 화면 (보상 강조)

```
목적: 7일 완주 시 포인트 보상 받는 핵심 동기 부여 화면

화면 구성:
  완료 축하 영역: 체크마크 아이콘 + "오늘 말씀 필사 완료!" 텍스트
  주간 완주 모달 오버레이:
    - 흰색(다크 모드에서는 #2A2D32) 팝업 카드
    - 상단: 축하 아이콘 + "이번 주 완주!" 타이틀
    - 본문: "7일 말씀필사 완주! 토스 포인트 10원 적립"
    - 포인트 금액 "10원" 강조 (Primary Blue, 대형)
    - "확인" 버튼

상단 캡션 오버레이:
  "7일 완주하면 토스 포인트 적립"

다크 모드 버전으로 제작
```

**Figma 작업**: 완료 화면 + 완주 모달 다크 모드 합성 스크린샷 + 636×1048 프레임

---

### 스크린샷 4: 포인트 현황 화면 (누적 보상 이력)

```
목적: 장기 사용자의 누적 보상 이력을 보여줌 — 지속 사용 동기 부여

화면 구성:
  "포인트 현황" 화면 전체
  누적 포인트 배너: "지금까지 모은 포인트" + "50원" (대형, 파란색)
  "7일 완주 5회 달성" 서브텍스트
  이번 주 현황: 주간 달력 (완주 상태)
  완주 기록 목록: 최근 5주 이력 표시

상단 캡션 오버레이:
  "완주 기록이 차곡차곡"

다크 모드 버전으로 제작
```

**Figma 작업**: 포인트 현황 화면 다크 모드 스크린샷 + 636×1048 프레임

---

## 에셋 7: 스크린샷 — 가로형

| 항목 | 내용 |
|------|------|
| 규격 | 1504 × 741 px |
| 포맷 | PNG |
| 최소 수량 | 1장 |
| Figma 저장 위치 | `5. Assets / Screenshots / horizontal/` |
| 앱인토스 등록 위치 | 콘솔 > 카테고리 및 노출 > 스크린샷 |

### 가로형 스크린샷 1: 필사 UX 전후 비교 (Before/After)

```
목적: 오버레이 필사 UX의 핵심 원리를 시각적으로 즉시 이해시킴

레이아웃 (2분할):
  [좌 절반]: "필사 전" 상태
    - 연한 회색 원문 텍스트만 표시된 필사 화면
    - 레이블: "원문이 희미하게"
  [중앙 구분선]: 얇은 세로 선
  [우 절반]: "필사 중" 상태
    - 동일 화면, 절반쯤 입력된 상태
    - 입력된 글자: 진한 흰색으로 원문 위를 덮음
    - 레이블: "타이핑하면 선명하게"

하단 배너:
  "손으로 쓰는 경건한 아침 — 말씀필사"

배경: 딥 네이비 (#131516)
```

**Google Stitch 프롬프트**:
```
Create a 1504x741px landscape screenshot for "말씀필사" Korean Bible app.

Split into two halves showing the overlay transcription UX before/after:

Left half:
  - Dark phone screen showing full Bible verse in very light gray text
  - Caption: "원문이 희미하게" (Guide text appears faint)

Right half:
  - Same screen with 60% of the text typed over in bright white
  - The guide text "disappears" as user types — dark text covers the gray
  - One red character showing a typo
  - Caption: "타이핑하면 선명하게" (Becomes vivid as you type)

Thin divider line between the two halves.
Bottom banner: "손으로 쓰는 경건한 아침 — 말씀필사"
Background: Very dark (#131516), all text in white and Toss Blue (#5A9FFF)
Style: Clean, explanatory, no religious imagery
```

---

## 에셋 8: OG Tag 이미지

| 항목 | 내용 |
|------|------|
| 규격 | 1200 × 630 px |
| 포맷 | PNG (또는 JPG) |
| Figma 저장 위치 | `5. Assets / OG Tag / og-image-1200x630.png` |
| 사용 위치 | 웹 링크 공유 시 미리보기 이미지 (카카오톡, 밴드, SNS 링크 공유) |

### 디자인 방향

```
카카오톡, 밴드 등 공유 시 노출되는 이미지 — 클릭율 최우선

레이아웃:
  [좌 40%] 앱 아이콘 (350×350px) + 서비스명 "말씀필사"
  [우 60%] 핵심 메시지 텍스트
    - 메인: "매일 한 절 필사하고"
    - 강조: "토스 포인트 받기" (Primary Blue, 대형)
    - 부제: "7일 완주 챌린지 — 하루 1~3분"

배경: 딥 네이비 (#1A1F2E)
텍스트: 흰색 + 토스 블루 강조
하단 우측: 토스 로고는 포함하지 않음 (브랜드 정책 미확인) — "앱인토스 제공" 텍스트만

목적: 교회 단톡방, 밴드에 공유될 때 한눈에 서비스를 이해할 수 있어야 함
```

### Google Stitch 생성 프롬프트

```
Create a 1200x630px Open Graph (OG) image for "말씀필사" Korean Bible transcription app.
This will be shared on KakaoTalk and Band (Korean social apps).

Layout:
Left 40%:
  - App icon: open Bible + quill pen, white on deep navy background (#1A1F2E), 350x350px
  - App name: "말씀필사" below icon, Noto Serif KR, white, large

Right 60%:
  - Line 1: "매일 한 절 필사하고" — white, Pretendard, 48px
  - Line 2: "토스 포인트 받기" — Toss Blue #5A9FFF, Pretendard Bold, 64px
  - Line 3: "7일 완주 챌린지 · 하루 1~3분" — light gray, 30px
  - Bottom small text: "앱인토스에서 지금 시작하기"

Background: Deep navy #1A1F2E, full area
Style: Clear, readable at small sizes, Korean text optimized
No cluttered graphics, text is the hero
```

---

## 에셋 9: Favicon

| 항목 | 내용 |
|------|------|
| 규격 | 32 × 32 px |
| 포맷 | PNG (또는 ICO) |
| Figma 저장 위치 | `5. Assets / Favicon / favicon-32x32.png` |
| 사용 위치 | 앱인토스 WebView 탭 아이콘 (브라우저 탭 표시) |

### 디자인 방향

```
32×32px 초소형 — 극단적 단순화 필수

구성:
  - 배경: 딥 네이비 (#1A1F2E) 정사각형
  - 아이콘: 단순화된 성경책 + 펜 조합 (픽셀 아트 수준으로 단순화)
  - 또는: 알파벳 "M" (말씀 M) 또는 한자 "筆" (필)을 Noto Serif KR 스타일로 단순 표기

권장 방식:
  - 앱 로고(600×600)를 32×32로 축소 후 선명도 수동 보정
  - 가장자리 픽셀이 흐려지지 않도록 주의
  - 배경색 있는 버전 사용 (투명 배경 불가)

Figma 작업:
  1. 앱 로고 600px 버전 복사
  2. 32×32 프레임으로 Export
  3. 이미지 선명도 확인 (Figma 프리뷰에서 100% 확대 확인)
```

---

## 에셋 제작 체크리스트

작업 완료 전 다음 항목을 모두 확인한다.

### 필수 에셋 (앱인토스 등록 필수)

- [ ] 앱 로고 (소) 600×600px PNG — 배경색 포함, 투명 배경 없음
- [ ] 정방형 썸네일 1000×1000px PNG — 핵심 화면 또는 로고 중심
- [ ] 가로형 썸네일 (스플래시 배너) 1932×828px PNG

### 권장 에셋 (우선 노출 혜택)

- [ ] 세로형 스크린샷 636×1048px PNG — 최소 3장
  - [ ] 1장: 필사 화면 (핵심 UX)
  - [ ] 2장: 홈 화면
  - [ ] 3장: 주간 완주 완료 화면
  - [ ] 4장: 포인트 현황 화면
- [ ] 가로형 스크린샷 1504×741px PNG — 최소 1장
  - [ ] 1장: 필사 UX 비교 화면

### 추가 에셋

- [ ] OG Tag 이미지 1200×630px PNG
- [ ] Favicon 32×32px PNG

### 공통 품질 기준

- [ ] 모든 에셋에서 "성경 번역 출처: 대한성서공회 개역한글판" 노출 여부 확인 (스크린샷에 포함되어 있으면 OK)
- [ ] 비속어, 정치적 표현, 저작권 위반 이미지 없음
- [ ] 과도한 텍스트 사용 여부 점검 (앱인토스 가이드 준수)
- [ ] 다크 모드 기준으로 제작되었으나 라이트 배경에서도 가독성 확인
- [ ] 토스 로고 또는 제공 아이콘 2차 가공 사용 여부 확인 → 사용 금지

---

## 파일 네이밍 규칙

```
app-logo-600.png          ← 앱 로고 소 (600×600)
app-logo-1000.png         ← 정방형 썸네일 (1000×1000)
splash-banner-1932x828.png ← 가로형 썸네일 (1932×828)
screenshot-v-01-writing.png  ← 세로 스크린샷 01: 필사 화면
screenshot-v-02-home.png     ← 세로 스크린샷 02: 홈 화면
screenshot-v-03-complete.png ← 세로 스크린샷 03: 완료/완주 화면
screenshot-v-04-points.png   ← 세로 스크린샷 04: 포인트 현황
screenshot-h-01-compare.png  ← 가로 스크린샷 01: 필사 UX 비교
og-image-1200x630.png       ← OG Tag 이미지
favicon-32x32.png           ← Favicon
```

---

## Figma 파일 Export 순서 (권장)

1. `5. Assets / App Icons / app-logo-600` 프레임 → PNG @1x Export
2. `5. Assets / App Icons / app-logo-1000` 프레임 → PNG @1x Export
3. `5. Assets / Thumbnails / splash-banner-1932x828` 프레임 → PNG @1x Export
4. `5. Assets / Screenshots / vertical / screenshot-v-01~04` 각 프레임 → PNG @1x Export
5. `5. Assets / Screenshots / horizontal / screenshot-h-01` 프레임 → PNG @1x Export
6. `5. Assets / OG Tag / og-image-1200x630` 프레임 → PNG @1x Export
7. `5. Assets / Favicon / favicon-32x32` 프레임 → PNG @1x Export

---

*문서 끝*
