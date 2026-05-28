import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();

// 앱 초기화는 한 번만 (서버리스 warm-start 재활용)
const appReady = NestFactory.create(AppModule, new ExpressAdapter(server), {
  logger: false,
}).then((app) => {
  app.enableCors();
  return app.init();
});

export const handler = async (req: any, res: any): Promise<void> => {
  await appReady;
  server(req as any, res as any);
};
