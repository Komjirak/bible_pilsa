// Vercel 서버리스 진입점 — 컴파일된 dist/app.handler.js 사용
const { handler } = require('../dist/src/app.handler');
module.exports = handler;
