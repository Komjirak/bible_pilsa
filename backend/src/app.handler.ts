import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let initError: Error | null = null;

// 모듈 로드 시 NestJS 초기화 — unhandled rejection 방지용 catch 포함
const appReady = NestFactory.create(AppModule, new ExpressAdapter(server), {
  logger: false,
})
  .then((app) => {
    app.enableCors();
    return app.init();
  })
  .catch((err: Error) => {
    initError = err;
    console.error('[app.handler] NestJS 초기화 실패:', err);
  });

export const handler = async (req: any, res: any): Promise<void> => {
  await appReady;
  if (initError) {
    res.status(500).json({ error: initError.message, stack: initError.stack });
    return;
  }
  server(req as any, res as any);
};
