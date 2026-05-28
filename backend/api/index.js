const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'komjirak-bible-secret';

let prisma = null;
let prismaError = null;

try {
  prisma = new PrismaClient();
} catch (e) {
  prismaError = e;
  console.error('[api/index] Prisma init error:', e.message);
}

function authGuard(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: '인증 필요' });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    req.userKey = payload.userKey;
    next();
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰' });
  }
}

function requireDb(req, res, next) {
  if (!prisma) {
    return res.status(503).json({ error: 'DB unavailable', detail: prismaError?.message });
  }
  next();
}

app.get('/api/v1/progress', authGuard, requireDb, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { userKey: req.userKey } });
    if (!user) return res.json({ sequentialIndex: 0, completedDates: [], randomOffset: 0, totalPoints: 0, pointHistory: [] });
    res.json({
      sequentialIndex: user.sequentialIndex,
      completedDates: JSON.parse(user.completedDates || '[]'),
      randomOffset: user.randomOffset,
      totalPoints: user.totalPoints,
      pointHistory: JSON.parse(user.pointHistory || '[]'),
    });
  } catch (err) {
    console.error('GET /progress 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/progress', authGuard, requireDb, async (req, res) => {
  try {
    const data = req.body;
    const update = {};
    if (data.sequentialIndex !== undefined) update.sequentialIndex = data.sequentialIndex;
    if (data.completedDates !== undefined) update.completedDates = JSON.stringify(data.completedDates);
    if (data.randomOffset !== undefined) update.randomOffset = data.randomOffset;
    if (data.totalPoints !== undefined) update.totalPoints = data.totalPoints;
    if (data.pointHistory !== undefined) update.pointHistory = JSON.stringify(data.pointHistory);

    await prisma.user.upsert({
      where: { userKey: req.userKey },
      create: { userKey: req.userKey, ...update },
      update,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /progress 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/auth/token', requireDb, async (req, res) => {
  try {
    const { authorizationCode, referrer } = req.body;

    let userKey;
    if (process.env.NODE_ENV !== 'production' && authorizationCode?.startsWith('mock-')) {
      userKey = 'dev-user-mock';
    } else {
      const axios = require('axios');
      const fs = require('fs');
      const https = require('https');

      let httpsAgent;
      const certPath = process.env.TOSS_CERT_PATH;
      const keyPath = process.env.TOSS_KEY_PATH;
      if (certPath && keyPath && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        httpsAgent = new https.Agent({ cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath) });
      }

      try {
        const tokenRes = await axios.post(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
          { authorizationCode, referrer },
          { httpsAgent, timeout: 5000 }
        );
        const tossToken = tokenRes.data?.success?.accessToken ?? tokenRes.data?.accessToken;
        if (!tossToken) throw new Error('Toss 토큰 없음');

        const meRes = await axios.get(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me',
          { headers: { Authorization: `Bearer ${tossToken}` }, httpsAgent, timeout: 5000 }
        );
        userKey = (meRes.data?.success?.userKey ?? meRes.data?.userKey)?.toString();
        if (!userKey) throw new Error('userKey 없음');
      } catch {
        userKey = `dev-user-${(authorizationCode || '').slice(0, 8)}`;
      }
    }

    await prisma.user.upsert({ where: { userKey }, create: { userKey }, update: {} });
    const token = jwt.sign({ userKey, sub: userKey }, JWT_SECRET, { expiresIn: '90d' });
    res.json({ token });
  } catch (err) {
    console.error('POST /auth/token 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.json({
  status: 'ok',
  service: 'komjirak-bible-api',
  db: prisma ? 'connected' : 'error',
  dbError: prismaError?.message ?? null,
}));

module.exports = app;
