import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly user: PrismaClient['user'];
  readonly weeklyChallenge: PrismaClient['weeklyChallenge'];
  readonly pointHistory: PrismaClient['pointHistory'];

  private readonly _client: any;

  constructor() {
    const url = process.env.DATABASE_URL ?? '';
    const isPrismaPostgres = url.startsWith('prisma+postgres://');
    const base = new PrismaClient(isPrismaPostgres ? { accelerateUrl: url } : {});
    this._client = isPrismaPostgres ? base.$extends(withAccelerate()) : base;

    this.user = this._client.user;
    this.weeklyChallenge = this._client.weeklyChallenge;
    this.pointHistory = this._client.pointHistory;
  }

  async onModuleInit() {
    await this._client.$connect();
  }
}
