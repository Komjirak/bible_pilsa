# Toss API Integration Learning & Troubleshooting

이 문서는 토스 앱인토스(Apps-in-Toss) 개발 과정에서 발생한 주요 오류(4010 등)와 mTLS 인증서 연동, 스마트 메시지 API 해결 방안을 요약합니다.

## 1. 토스 로그인 (OAuth2) & mTLS 이슈

### 🚨 주요 문제 (4010 Error)
토스 API(`generate-token`, `login-me`) 호출 시 `4010 - Unauthorized` 또는 인증 실패 오류가 지속적으로 발생함.

### ✅ 원인 분석
1. **mTLS 인증 누락**: 일반적인 HTTPS 요청이 아닌, 토스에서 발급받은 기업용 공개키/개인키(.crt, .key)를 이용한 Mutual TLS 통신이 필수임.
2. **헤더 구성 불일치**: `userKey` 조회 단계에서 `Authorization: Bearer {accessToken}` 형식이 정확하지 않거나, 토큰 만료 시간이 짧음.

### 🛠 해결 방안
- **NestJS/Node.js mTLS 구현**: `https.Agent`를 생성할 때 `fs.readFileSync`로 인증서를 로드하여 axios 옵션에 주입하도록 수정.
```typescript
const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./certs/toss-public.crt'),
  key: fs.readFileSync('./certs/toss-private.key'),
});
```
- **2-Step Flow 준수**: `authorizationCode` -> `generate-token` -> `login-me` (userKey 획득) 과정을 거쳐야만 정확한 유저 식별이 가능함.

## 2. 스마트 메시지 (Push) 연동

### 🚨 주요 문제
푸시 발송 시 템플릿 코드 오류 또는 메시지 도달 실패.

### ✅ 해결 방안
- **Template Context Mapping**: 토스 콘솔에 등록된 변수(예: `{{time}}`)와 백엔드에서 넘겨주는 JSON 키값이 일치해야 함.
- **API Endpoint**: 파트너 전용 엔드포인트(`apps-in-toss-api.toss.im`)를 사용하며, 역시 mTLS 인증서가 필요함.
- **X-Toss-User-Key**: 헤더에 정확한 사용자 고유 키를 포함해야 함.

## 3. 개발 및 테스트 환경 (Sandbox)

### 🚨 주요 문제
로컬 서버(localhost)와 토스 샌드박스 앱 간의 통신 불가능 (SSL/IP 이슈).

### ✅ 해결 방안
- **터널링 솔루션 활용**: `cloudflared` 또는 `localtunnel`을 사용하여 로컬 3001(BE), 3000(FE) 포트를 외부 HTTPS 주소로 노출.
- **URL Scheme 브릿지**: 토스 샌드박스 앱에서 `toss://` 스킴을 사용하여 외부 URL로 진입하는 방식으로 실제 WebView 환경 테스트 가능.

## 4. 내비게이션 및 정책 대응

### 🚨 주요 문제
자체 구현한 `<` (뒤로가기) 버튼이 토스 앱 본체의 헤더와 중첩되어 사용자 혼란 및 반려 사유 발생.

### ✅ 해결 방안
- **중복 UI 제거**: `AppNavBar`에서 특정 페이지(설정, 포인트) 진입 시 뒤로가기 버튼을 숨김 처리하고, 토스 앱의 네이티브 뒤로가기를 사용하거나 하단에 명시적인 '홈으로' 버튼을 배치.
- **100dvh 적용**: 모바일 웹뷰에서 키보드가 올라올 때 레이아웃이 깨지는 현상을 방지하기 위해 CSS 단위를 `100vh`에서 `100dvh`로 전환.

---
**💡 교훈**: 토스 플랫폼 연동은 단순 기능 구현보다 **보안인증(mTLS/OAuth2)**과 **네이티브 경험(UI 정책)** 준수가 완성도의 핵심임.
