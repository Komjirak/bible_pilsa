// Vercel 서버리스 진입점 — 컴파일된 dist/src 사용
module.exports = async (req, res) => {
  try {
    const { handler } = require('../dist/src/app.handler');
    await handler(req, res);
  } catch (err) {
    console.error('[api/index] 초기화 실패:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
