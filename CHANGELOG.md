# Changelog

## [1.0.0] - 말씀필사 (Bible-Pilsa) Apps-in-Toss Release

### ✨ Features
- **Toss 로그인 연동 내재화:**
  - AES-256-GCM 알고리즘을 사용한 사용자 E-mail 복호화 로직 백엔드 유틸리티(`toss-crypto.util.ts`) 추가 처리 완료.
- **7일 완주 리워드 연동 (executePromotion):**
  - 기존 mTLS 기업 인증망 통신에서 권장 규격인 `executePromotion` (Bearer + `x-toss-user-key`) 방식으로 `PointService` 전면 개편.
  - 7일 차 말씀 필사 완료 시 자동으로 토스 10원 리워드 지급 API 발송 로직 체결.
- **Toss Ads 인앱광고 2.0 연동:**
  - **홈 화면:** 화면 하단 고정 영역에 `AdBanner` 컴포넌트 추가 (`ait.v2.live.ae8e04b2200544f5`).
  - **완료 화면:** 오늘의 말씀을 성공 제출 후 `홈으로` 복귀 시 전면 인터스티셜(Interstitial) 광고 송출 후 전환 동작 연계 (`ait.v2.live.6255b174cfea47ca`).
- **서비스 약관 및 설정 화면:**
  - `Terms of Service`(서비스 이용약관) HTML 페이지 자체 레포지토리 배포.
  - 설정 화면 내 법적 고지 탭 이름 변경 및 라우팅 추가, 성경 소스본 출처 (개역한글 1961) 명시.

### 🎨 UI/UX & Design System
- **TDS (Toss Design System) 마이그레이션:**
  - 기존 낡은 주황색 원고지(Warm Paper) 테마에서 탈피하여, 화이트(밝은 톤) 배경과 토스 블루(`#3182F6`) 포인트 컬러의 정식 TDS 레이아웃으로 전면 개편.
- **말씀 카드 UI 고도화:**
  - `TodayVerseCard`의 레이아웃을 실제 성경책 도서 모형(책등 두께, 양피지 제본선, 리본 책갈피) 구조로 변경하여 퀄리티 향상.
- **App-in-Toss 글로벌 네비게이션 준수:**
  - 토스 앱 네이티브 헤더와의 충돌을 막기 위해 자체 웹 DOM 기반 `<` 형태의 물리 뒤로가기 버튼을 일괄 제거 (`AppNavBar`).

### 📦 Chore
- `@apps-in-toss/web-framework` SDK 버전 `v2.0.1` 호환성 업데이트 완료.
