import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // CORS — 앱인토스 WebView origin만 허용
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN ?? '*',
    credentials: true,
  });

  // 전역 Validation Pipe (DTO 자동 검증)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 전역 Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api/v1', { exclude: ['auth/token', 'health'] });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`[komjirak-bible-api] listening on port ${port}`);
}

bootstrap();
