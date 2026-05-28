import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL ?? '';
    // Prisma Accelerate URL은 accelerateUrl 옵션, 일반 PostgreSQL은 환경변수 자동 사용
    super(url.startsWith('prisma+postgres://') ? { accelerateUrl: url } : {});
  }

  async onModuleInit() {
    await this.$connect();
  }
}
