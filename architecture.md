BE_REQUIRED: true
BE_STACK: NestJS

# 아키텍처 설계서 — 말씀필사 (Bible-Pilsa)

> 문서 버전: v1.0
> 작성일: 2026년 3월 6일
> 작성 주체: DEV-ORCHESTRATOR AGENT (STAGE 3)
> 참조 문서: `prd.md`, `business-logic.md`, `design-spec.md`

---

## 1. BE 필요 여부 판단

### 결론: **BE 필요 (BE_REQUIRED: true)**

### 판단 근거

| 조건 | 판정 | 근거 |
|------|------|------|
| 사용자 인증/세션 관리 필요 | ✅ 필요 | 토스 OAuth2 authorizationCode → accessToken 교환은 반드시 BE에서 처리 (클라이언트 노출 불가) |
| DB에 데이터를 저장/조회해야 함 | ✅ 필요 | CompletionRecord, WeeklyChallenge, PointTransaction 테이블에 사용자별 완료 이력 저장 필수 |
| 외부 API를 서버에서 호출해야 함 (API Key 보안) | ✅ 필요 | 앱인토스 Point API는 mTLS 인증서 기반 BE-to-BE 호출 (FE에서 직접 호출 불가) |
| 보안상 클라이언트에 노출 불가한 로직 존재 | ✅ 필요 | Fraud 방지 2차 유사도 검증, 중복 완주 방지 (DB UNIQUE 제약), 포인트 지급 신뢰성 보장 |
| 정적 콘텐츠 조회만 필요 | ❌ 해당 없음 | 필사 완료 처리, 주간 챌린지 상태 관리, 포인트 지급 등 동적 처리 필수 |
| 토스 SDK만으로 결제/인증 처리 가능 | ❌ 해당 없음 | appLogin() 이후 토큰 교환은 BE 필수 |

### 이후 실행할 에이전트 목록

1. **STAGE 4-A: FE AGENT** — 항상 실행
2. **STAGE 4-B: BE AGENT** — BE_REQUIRED: true이므로 실행 (FE 완료 후 순차)
3. **STAGE 4-D: DESIGN-ASSET AGENT** — STAGE 4와 병렬 실행

---

## 2. 시스템 구성도

```mermaid
flowchart TD
    subgraph 사용자_단말["사용자 단말 (iOS / Android)"]
        A[토스 앱]
        B[말씀필사 WebView\n@apps-in-toss/web-framework@2.0.1]
    end

    subgraph FE["Frontend (Next.js)"]
        B1[홈 화면]
        B2[필사 화면 OverlayTextCanvas]
        B3[완료 화면]
        B4[포인트 현황]
        B5[설정]
        B6[성경 번들 bible-kjv-1961.json]
        B7[Levenshtein 1차 유사도 검사]
        B8[IAA SDK 광고 모듈]
    end

    subgraph BE["Backend (NestJS)"]
        C1[Auth Module\nOAuth2 토큰 교환 / JWT 발급]
        C2[DailyVerse Module\n결정론적 말씀 선정]
        C3[Completion Module\n2차 유사도 검증 / Fraud 감지]
        C4[WeeklyChallenge Module\n주간 완주 판단]
        C5[Point Module\n포인트 지급 + 재시도 큐]
    end

    subgraph 외부["외부 서비스"]
        D1[앱인토스 OAuth2 API]
        D2[앱인토스 Point API\nmTLS]
        D3[IAA 광고 네트워크]
    end

    subgraph DB["데이터 계층"]
        E1[(PostgreSQL\nUsers / CompletionRecord\nWeeklyChallenge / PointTransaction)]
        E2[(Redis\n세션 캐시 / 중복 방지 Lock\nFraud 신호 임시 저장)]
    end

    A -->|앱인토스 탭| B
    B --> FE
    FE -->|REST API / JWT| BE
    C1 -->|POST generate-token| D1
    C1 -->|GET login-me| D1
    C5 -->|mTLS Point API| D2
    BE <--> E1
    BE <--> E2
    B8 --> D3
```

---

## 3. 폴더 구조

### 3-1. Frontend (`$PROJECT_DIR/output/frontend/`)

```
frontend/
├── .env.local.example
├── ait.config.js               ← 앱인토스 빌드 설정
├── next.config.js
├── package.json
├── tsconfig.json
├── public/
│   └── fonts/
│       ├── Pretendard-*.woff2
│       └── NotoSerifKR-*.woff2
└── src/
    ├── app/                    ← Next.js App Router
    │   ├── layout.tsx          ← DarkModeProvider, 글로벌 CSS
    │   ├── page.tsx            ← 홈 화면 (/)
    │   ├── writing/
    │   │   └── page.tsx        ← 필사 화면 (/writing)
    │   ├── completion/
    │   │   └── page.tsx        ← 완료 화면 (/completion)
    │   ├── points/
    │   │   └── page.tsx        ← 포인트 현황 (/points)
    │   └── settings/
    │       └── page.tsx        ← 설정 (/settings)
    ├── components/
    │   ├── global/
    │   │   ├── AppNavBar.tsx
    │   │   ├── CopyrightFooter.tsx
    │   │   └── DarkModeProvider.tsx
    │   ├── home/
    │   │   ├── TodayVerseCard.tsx
    │   │   ├── WeeklyCalendarStrip.tsx
    │   │   ├── WeeklyProgressBadge.tsx
    │   │   ├── CTAButton.tsx
    │   │   └── AlreadyDoneCard.tsx
    │   ├── writing/
    │   │   ├── OverlayTextCanvas.tsx  ← 핵심 컴포넌트
    │   │   ├── ProgressBar.tsx
    │   │   ├── VerseHeader.tsx
    │   │   ├── HiddenTextInput.tsx
    │   │   ├── CompletionButton.tsx
    │   │   └── SimilarityResultToast.tsx
    │   ├── completion/
    │   │   ├── CompletionAnimation.tsx
    │   │   ├── WeeklyProgressCard.tsx
    │   │   ├── WeeklyCompleteModal.tsx
    │   │   ├── AdContainer.tsx
    │   │   └── ActionButtons.tsx
    │   ├── points/
    │   │   ├── TotalPointBanner.tsx
    │   │   ├── WeeklyCompleteStatus.tsx
    │   │   ├── CompletionHistoryList.tsx
    │   │   └── PointGrantedBadge.tsx
    │   └── settings/
    │       ├── NotificationTimePicker.tsx
    │       ├── FontSizeAdjuster.tsx
    │       ├── SettingListItem.tsx
    │       ├── PrivacyPolicyLink.tsx
    │       └── AppVersionInfo.tsx
    ├── hooks/
    │   ├── useBridgeSDK.ts     ← 앱인토스 Bridge SDK 초기화
    │   ├── useAuth.ts          ← 로그인 상태 관리
    │   ├── useDailyVerse.ts    ← 오늘의 말씀 fetch
    │   ├── useWeeklyStatus.ts  ← 주간 현황 fetch
    │   └── useFraudDetection.ts ← 타이핑 속도/붙여넣기 감지
    ├── lib/
    │   ├── similarity.ts       ← Levenshtein 1차 검사 (클라이언트)
    │   ├── api.ts              ← BE REST API 클라이언트
    │   └── dateUtils.ts        ← KST 날짜 유틸
    ├── data/
    │   └── bible-kjv-1961.json ← 개역한글판 성경 데이터 번들 (~4MB)
    ├── styles/
    │   ├── globals.css         ← CSS 변수 (컬러 토큰, 다크모드)
    │   └── typography.css      ← 타입 스케일
    └── types/
        ├── api.ts
        └── bible.ts
```

### 3-2. Backend (`$PROJECT_DIR/output/backend/`)

```
backend/
├── .env.example
├── package.json
├── tsconfig.json
├── nest-cli.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts  ← POST /auth/token, POST /auth/refresh
    │   ├── auth.service.ts     ← OAuth2 교환, JWT 발급
    │   └── jwt.strategy.ts
    ├── daily-verse/
    │   ├── daily-verse.module.ts
    │   ├── daily-verse.controller.ts  ← GET /api/v1/daily-verse
    │   └── daily-verse.service.ts     ← 결정론적 말씀 선정 (sha256 + 인덱스)
    ├── completion/
    │   ├── completion.module.ts
    │   ├── completion.controller.ts   ← POST /api/v1/complete
    │   ├── completion.service.ts      ← 2차 검증, Fraud 감지, 완료 처리
    │   └── fraud.service.ts           ← Fraud 신호 종합 평가
    ├── weekly-challenge/
    │   ├── weekly-challenge.module.ts
    │   ├── weekly-challenge.controller.ts  ← GET /api/v1/weekly-status
    │   └── weekly-challenge.service.ts     ← 주간 완주 판단
    ├── point/
    │   ├── point.module.ts
    │   ├── point.service.ts       ← Point API 호출 + 재시도 큐
    │   └── point-retry.worker.ts  ← Bull 큐 워커 (지수 백오프)
    ├── bible/
    │   ├── bible.module.ts
    │   └── bible-data.ts          ← 서버 사이드 성경 데이터 (2차 검증용)
    └── common/
        ├── guards/jwt.guard.ts
        ├── interceptors/logging.interceptor.ts
        └── filters/global-exception.filter.ts
```

---

## 4. 기술 스택

### 4-1. Frontend

| 항목 | 기술 | 버전 | 이유 |
|------|------|------|------|
| 프레임워크 | Next.js | 15.x (App Router) | 앱인토스 WebView 미니앱 표준, SSR 불필요하나 Next.js 생태계 활용 |
| 언어 | TypeScript | 5.x | 타입 안전성 |
| 앱인토스 SDK | @apps-in-toss/web-framework | 2.0.1 | 필수 — Bridge SDK, 빌드 도구 |
| 빌드 | ait build | SDK 2.0.1 기준 | .ait 번들 생성 (앱인토스 제출용) |
| UI 컴포넌트 | @toss/tds-mobile | >=1.0.0 | TDS 필수 적용 (비게임 WebView) |
| 상태 관리 | Zustand | 4.x | 경량, 단순한 전역 상태 (auth, fontSize, weeklyStatus) |
| 스타일링 | CSS Modules + CSS Variables | — | TDS 토큰 기반, 다크모드 자동 연동 |
| 유사도 계산 | fast-levenshtein | — | 클라이언트 1차 검증 (경량) |
| 애니메이션 | Lottie-web | — | 완료 축하 애니메이션 |
| 폰트 | Pretendard + Noto Serif KR | — | 로컬 woff2 번들 (CDN 의존 없음) |

### 4-2. Backend

| 항목 | 기술 | 버전 | 이유 |
|------|------|------|------|
| 프레임워크 | NestJS | 10.x | TypeScript 네이티브, DI/모듈 구조, mTLS 설정 용이 |
| 언어 | TypeScript | 5.x | FE와 통일 |
| ORM | Prisma | 5.x | 타입 안전 쿼리, 마이그레이션 관리 |
| DB | PostgreSQL | 16.x | UNIQUE 제약(중복 완료 방지), 트랜잭션 신뢰성 |
| 캐시/잠금 | Redis (ioredis) | — | 세션 캐시, 동시 요청 중복 방지 Lock, Fraud 신호 임시 저장 |
| 잡 큐 | Bull (BullMQ) | — | 포인트 지급 재시도 큐 (지수 백오프) |
| 인증 | passport-jwt | — | 자체 JWT 검증 |
| HTTP 클라이언트 | axios | — | 앱인토스 API 호출 (mTLS 설정 포함) |
| 환경변수 | @nestjs/config | — | .env 로딩 |

### 4-3. 공통

| 항목 | 기술 |
|------|------|
| 앱인토스 Bridge SDK | @apps-in-toss/web-framework@2.0.1 |
| React | 19.2.3 (SDK 내장 기준) |
| 빌드 커맨드 | `ait build` |
| CORS | `bible-pilsa.apps.tossmini.com` Origin 허용 |
| 통신 보안 | HTTPS + mTLS (앱인토스 Point API 구간) |

---

## 5. API 목록

### 5-1. 인증 (Auth)

| Method | Endpoint | 설명 | 요청 | 응답 |
|--------|---------|------|------|------|
| POST | `/auth/token` | authorizationCode → accessToken 교환 + JWT 발급 | `{ authorizationCode, referrer }` | `{ token, expiresIn }` |
| POST | `/auth/refresh` | refreshToken → 새 accessToken | `{ refreshToken }` | `{ token, expiresIn }` |
| DELETE | `/auth/withdraw` | 회원 탈퇴 (로그인 끊기) | — | `{ success }` |

### 5-2. 말씀 (DailyVerse)

| Method | Endpoint | 설명 | 요청 | 응답 |
|--------|---------|------|------|------|
| GET | `/api/v1/daily-verse` | 오늘의 말씀 조회 | Header: `Authorization: Bearer {jwt}` | `{ date, book, chapter, verse, text }` |

### 5-3. 필사 완료 (Completion)

| Method | Endpoint | 설명 | 요청 Body | 응답 |
|--------|---------|------|----------|------|
| POST | `/api/v1/complete` | 필사 완료 처리 (2차 검증 + Fraud 판단 + 포인트 트리거) | `{ date, typedText, typingDurationMs, typingStartAt, pasteAttempts, clientSimilarity }` | `{ success, similarity, weekProgress, weeklyComplete, pointGranted }` |

### 5-4. 주간 현황 (WeeklyChallenge)

| Method | Endpoint | 설명 | 요청 | 응답 |
|--------|---------|------|------|------|
| GET | `/api/v1/weekly-status` | 주간 완료 현황 조회 | Header: JWT | `{ weekStart, weekEnd, completedDays[7], completedCount, pointGranted, totalCompletions, totalPointsEarned }` |

### 5-5. 포인트 이력 (Points)

| Method | Endpoint | 설명 | 요청 | 응답 |
|--------|---------|------|------|------|
| GET | `/api/v1/points/history` | 포인트 지급 이력 조회 (최대 12주) | Header: JWT | `{ totalEarned, completions: [{ weekStart, amount, status }] }` |

---

## 6. 데이터 모델

### Prisma Schema 핵심 엔티티

```prisma
model User {
  userKey            String              @id          // 앱인토스 고유 userKey
  registeredAt       DateTime            @default(now())
  totalCompletions   Int                 @default(0)
  totalPointsEarned  Int                 @default(0)
  completionRecords  CompletionRecord[]
  weeklyChallenges   WeeklyChallenge[]
  pointTransactions  PointTransaction[]
}

model CompletionRecord {
  id               String   @id @default(cuid())
  userKey          String
  date             String   // YYYY-MM-DD (KST)
  verseBook        String
  verseChapter     Int
  verseVerse       Int
  similarityScore  Float
  typingDurationMs Int
  pasteAttempts    Int      @default(0)
  fraudFlagged     Boolean  @default(false)
  completedAt      DateTime @default(now())
  user             User     @relation(fields: [userKey], references: [userKey])

  @@unique([userKey, date])   // 하루 1회 완료 제약
}

model WeeklyChallenge {
  id             String   @id @default(cuid())
  userKey        String
  weekStart      String   // YYYY-MM-DD (월요일)
  completedDays  Int      @default(0)    // 0~7 누적
  pointGranted   Boolean  @default(false)
  grantedAt      DateTime?
  user           User     @relation(fields: [userKey], references: [userKey])

  @@unique([userKey, weekStart])
}

model PointTransaction {
  id                       String   @id @default(cuid())
  userKey                  String
  weekStart                String
  amount                   Int      @default(10)
  status                   String   @default("pending")  // pending / completed / failed
  appsInTossTransactionId  String?
  retryCount               Int      @default(0)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
  user                     User     @relation(fields: [userKey], references: [userKey])

  @@unique([userKey, weekStart])   // 주당 1회 지급 제약
}
```

### ERD 요약

```
User (1) ──── (N) CompletionRecord  [UNIQUE: userKey + date]
User (1) ──── (N) WeeklyChallenge   [UNIQUE: userKey + weekStart]
User (1) ──── (N) PointTransaction  [UNIQUE: userKey + weekStart]
```

---

## 7. 앱인토스 SDK 연동 계획

### 7-1. Bridge SDK 초기화

```typescript
// src/hooks/useBridgeSDK.ts
import { bridge } from '@apps-in-toss/web-framework';

export function useBridgeSDK() {
  // SDK 초기화 — 앱인토스 웹뷰 환경 감지 후 자동 초기화
  // bridgeColorMode: 'basic' → 토스 앱 다크모드 자동 연동

  const initialize = async () => {
    await bridge.initialize({
      webViewProps: {
        type: 'partner',
        appName: 'bible-pilsa',
        bridgeColorMode: 'basic',
      }
    });
  };

  return { initialize };
}
```

### 7-2. 사용 SDK 기능 목록

| 기능 | SDK API | 사용 화면 |
|------|---------|---------|
| 토스 로그인 | `bridge.appLogin()` | 첫 실행 / 세션 만료 시 |
| 네비게이션 (뒤로가기 제어) | `bridge.navigation.back()` | 필사 화면 (완료 전 뒤로가기 방지) |
| 다크모드 연동 | `bridgeColorMode: 'basic'` | 전체 앱 |
| Push 알림 등록 | `bridge.notification.request()` | 설정 화면 |
| 앱 버전 정보 | `bridge.device.getInfo()` | 설정 화면 |
| 햅틱 피드백 | `bridge.haptic.impact()` | 오타 입력 시 (선택) |

### 7-3. 앱인토스 API 연동 (BE)

| 기능 | API | 인증 방식 |
|------|------|---------|
| OAuth2 토큰 교환 | POST /api-partner/v1/apps-in-toss/user/oauth2/generate-token | API Key |
| 사용자 정보 조회 | GET /api-partner/v1/apps-in-toss/user/oauth2/login-me | Bearer accessToken |
| 포인트 지급 | 앱인토스 Point API (엔드포인트 계약 후 확정) | mTLS |

---

## 8. 환경변수 목록

### 8-1. Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=https://api.bible-pilsa.apps.tossmini.com
NEXT_PUBLIC_APP_NAME=bible-pilsa
NEXT_PUBLIC_APP_ENV=production          # development / production
```

### 8-2. Backend (`.env`)

```env
# 서버
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bible_pilsa

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<랜덤 256비트 시크릿>
JWT_EXPIRES_IN=7d

# 앱인토스 OAuth2
APPS_IN_TOSS_CLIENT_ID=<앱인토스 발급 클라이언트 ID>
APPS_IN_TOSS_CLIENT_SECRET=<앱인토스 발급 시크릿>
APPS_IN_TOSS_TOKEN_URL=https://api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token
APPS_IN_TOSS_USER_ME_URL=https://api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me
APPS_IN_TOSS_AES_KEY=<앱인토스 발급 AES-256-GCM 복호화 키>

# 앱인토스 Point API (계약 후 확정)
APPS_IN_TOSS_POINT_API_URL=<엔드포인트>
APPS_IN_TOSS_MTLS_CERT_PATH=./certs/client.crt
APPS_IN_TOSS_MTLS_KEY_PATH=./certs/client.key

# CORS
ALLOWED_ORIGINS=https://bible-pilsa.apps.tossmini.com,http://localhost:3001
```

---

## 9. 자기 검증 체크리스트

- [x] `architecture.md` 첫 줄에 `BE_REQUIRED: true` 명시
- [x] `BE_STACK: NestJS` 명시
- [x] 판단 근거가 기준표 항목별로 기재됨
- [x] 시스템 구성도 (Mermaid flowchart) 포함
- [x] 앱인토스 Bridge SDK 연동 계획 포함
- [x] 이후 실행할 에이전트 목록 명시 (FE, BE, DESIGN-ASSET)

---

*문서 끝*
