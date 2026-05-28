// Vercel 서버리스 진입점
let handler;
let loadError;

// 최상위에서 require → Vercel 번들러가 dist 파일을 포함하도록 강제
try {
  ({ handler } = require('../dist/src/app.handler'));
} catch (err) {
  loadError = err;
  console.error('[api] 모듈 로드 실패:', err);
}

module.exports = async (req, res) => {
  if (loadError) {
    return res.status(500).json({ error: loadError.message, stack: loadError.stack });
  }
  try {
    await handler(req, res);
  } catch (err) {
    console.error('[api] 핸들러 오류:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
