# 말씀필사 (Komjirak Bible) PRD 및 구축 가이드

이 문서는 토스 앱 내에서 구동되는 "말씀필사" 미니앱을 새롭게 (처음부터) 구축하기 위한 Product Requirements Document(PRD) 겸 개발 프롬프트입니다. Antigravity AI가 이 문서를 읽고 오류 없이 완벽하게 앱을 재구축할 수 있도록, 기존에 겪었던 시행착오와 토스 SDK 연동 규칙을 모두 포함하고 있습니다.

---

## 1. 개요 (Product Overview)
* **목표:** 토스 사용자들에게 매일 1절의 성경 말씀을 필사(따라 쓰기)하는 경험을 제공하고, 연속 달성 시 토스 '달란트'(리워드)를 지급하는 힐링 미니앱 구축.
* **핵심 기능:**
  - 토스 계정 연동 (앱인토스 로그인)
  - 매일 랜덤 또는 순차적 성경 구절 제공 및 필사 검증 (유사도 체크)
  - 7일 연속 접속/필사 시 달란트 지급
  - 보상형 전면/배너 광고 시청 시 추가 달란트 지급
* **용어 원칙:** 토스포인트와의 혼선을 막기 위해 앱 내의 보상 명칭은 무조건 **"달란트"**로 통일합니다. ("리워드", "포인트" 사용 금지)

---

## 2. 기술 스택 (Tech Stack)
* **Frontend:**
  - React 19, Vite, TypeScript
  - Routing: `react-router-dom`
  - State Management: `zustand` (인증 등 전역 상태 관리 필수)
  - Toss SDK: `@apps-in-toss/web-bridge`, `@apps-in-toss/web-framework` v2.0.5
* **Backend:**
  - NestJS, Fastify, TypeScript
  - ORM: Prisma (PostgreSQL 연결)
  - Authentication: JWT, mTLS (토스 OAuth2 `/generate-token`, `/login-me` API 통신)

---

## 3. 핵심 규칙 및 크리티컬 이슈 해결안 (MUST READ)
AI 에이전트는 기작성된 코드를 피하기 위해 아래 사항을 **반드시** 숙지하고 아키텍처를 설계해야 합니다.

### 3.1 토스 로그인 동선 및 브릿지 버그 주의사항
1. **`appLogin` 정적 임포트 필수:**
   - 팝업 로그인(`appLogin()`)을 호출할 때 `await import('@apps-in-toss/web-bridge')`와 같이 동적 임포트를 쓰면, 모바일 기기의 WebView에서 사용자의 '클릭 이벤트(Trusted Event)' 컨텍스트가 훼손되어 **로그인 팝업이 먹통이 되는 버그**가 발생합니다. 반드시 파일 상단에서 `import { appLogin } ...`으로 정적 임포트하세요.
2. **다중 인스턴스 방지 (Zustand 사용):**
   - 기존의 커스텀 훅(`useAuth`)을 `useState`와 `useEffect`로만 만들면, 여러 페이지 컴포넌트(`<IntroPage>`, `<HomePage>`)에 의해 `appLogin()`이 다중 호출되는 치명적 버그가 발생합니다.
   - 인증 상태와 `appLogin` 핸들링은 **반드시 Zustand 등 전역 상태 스토어**로 구성하고, `App.tsx` 최상단에서 단 1회만 초기화(`initialize`)해야 합니다.
3. **네트워크 에러 (Load failed) 방지:**
   - 모바일 기기(토스 앱)에서 서버와 통신하려면 프로덕션 빌드 시 올바른 백엔드 주소가 필요합니다.
   - Vite 환경에서 `VITE_API_BASE_URL`이 누락되면 `localhost:3000`으로 요청을 보내면서 폰에서 Silent Network Error(Load failed)를 냅니다.
   - 토스앱 배포용 빌드를 위해 **반드시 `.env.production` 파일**을 만들고 실제 라이브 서버 URL(예: Cloudflare tunnel URL 등)을 명시해야 합니다.

### 3.2 UI 플로우 명세
1. **미인증 사용자 진입 (`/intro`):**
   - 무조건 `/intro`로 진입합니다. "매일 성경 말씀을 필사하고 달란트 받아가세요" 텍스트 노출.
   - **"시작하기"** 버튼 클릭 ⟶ `appLogin()` 동기적 호출 ⟶ 동의 팝업 ⟶ 성공 시 JWT 발급(`exchangeToken`) ⟶ 필사 화면(`/writing`)으로 바로 이동.
   - *에러 처리:* 로그인 실패 시 `alert`로 사유 발생 고지 (단, 유저가 창을 직접 닫은 Cancel 예외는 얼럿 생략).
2. **인증 완료 사용자 진입 (`/` 홈):**
   - 현재 주간 완주 현황(0~7일 StampBoard) 노출.
   - 하단 버튼 2개: "지금 필사하기", "달란트 현황".
   - 백엔드 조회(`getWeeklyStatus`)가 앱 구동/통신 오류로 실패하더라도 `0`으로 리셋되지 않고 에러 스토리지에 캐싱된 직전 값을 노출해야 합니다.
3. **필사 화면 (`/writing`):**
   - 사용자가 텍스트 입력박스(textarea/canvas)에 말씀을 따라 적음.
   - 제출 전 유사도(Similarity) 검사 수행 로직 포함.
   - "랜덤 구절"과 "순차 구절" 모드를 상태로 분기 관리.
   - 제출 후 성공하면 `/completion`으로 리다이렉트.
4. **결과 및 달란트 화면 (`/completion`, `/points`):**
   - 일일 완료 리포트 노출 완료.
   - Toss Ad SDK(`useFullScreenAd`) 등 보상형 웹 전면 광고 연동 준비.
   - 달란트 획득 내역 리스트 표기.

---

## 4. 백엔드(NestJS) 연동 규칙
1. **토큰 교환 (`POST /api/v1/auth/token`):**
   - 프론트에서 넘어온 `authorizationCode`와 `referrer`를 받아 토스 서버(`/api-partner/v1/apps-in-toss/user/oauth2/generate-token`)로 넘김.
   - **mTLS 인증서 (`.crt`, `.key`) 파싱 로직 필수:** `httpsAgent`로 요청해야 토스 서버가 응답함.
2. **DB 스키마 (Prisma):**
   - `User` 테이블: `userKey`(PK, 토스 제공), `createdAt`, `notification_time`
   - `WeeklyChallenge` 테이블: `userKey`(FK), `weekStart`, `completedDays`, `pointGranted`
     - *주의* Prisma Upsert 수행 시 increment된 값을 프론트 단에서 오염시키지 않도록 API 리스폰스 DTO 매핑을 신중하게 작성할 것. (이슈 이력 있음)
   - `PointHistory` 테이블: `id`, `userKey`, `amount`, `reason`, `createdAt`

---

## 5. 지시사항 (Action Items)
Agent는 현재 디렉토리를 초기화하고(필요시) 위 PRD를 바탕으로 다음을 순차적으로 수행하세요.
1. `package.json` 세팅 및 Toss SDK (v2.0.5), React 19, Vite, Zustand 설치.
2. API 통신용 Axios/Fetch 래퍼 구성 및 `.env.production` 처리 로직 세팅.
3. Zustand 방식의 `useAuth` 전역 상태 머신 구현 (`appLogin` 정적 임포트 준수).
4. `intro ⟶ 로그인 승인 ⟶ writing`로 직결되는 라우팅 및 에러 핸들링 코딩.
5. 필사, 주간 현황, 달란트 페이지의 핵심 컴포넌트 UI 개발.
6. 백엔드(NestJS) mTLS 토스 토큰 교환 모듈 구현.

> 자, 이해했으면 이 문서를 바탕으로 처음부터 완벽한 "말씀필사" 미니앱을 구축해줘!
