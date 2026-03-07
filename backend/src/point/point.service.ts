import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 7일 완주 포인트 지급 (토스 Point API, mTLS)
  async grantWeeklyCompletePoint(userKey: string, weekStart: string): Promise<void> {
    const amount = Number(process.env.WEEKLY_COMPLETE_POINT_AMOUNT ?? 10);
    const apiUrl = process.env.TOSS_POINT_API_URL;
    const certPath = process.env.TOSS_POINT_CLIENT_CERT_PATH;
    const keyPath = process.env.TOSS_POINT_CLIENT_KEY_PATH;

    if (!apiUrl || !certPath || !keyPath) {
      // 개발 환경 — mock
      this.logger.warn(`[point] mTLS env 미설정 — 포인트 지급 mock: userKey=${userKey} amount=${amount}`);
      await this.prisma.pointTransaction.create({
        data: {
          userKey,
          weekStart,
          amount,
          reason: 'weekly_complete_7days',
          tossOrderId: `mock-${Date.now()}`,
        },
      });
      return;
    }

    // mTLS 클라이언트 인증서 로드
    const httpsAgent = new https.Agent({
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    });

    const orderId = `bp-${userKey.slice(0, 8)}-${weekStart}`;
    const { data } = await axios.post(
      apiUrl,
      { userKey, orderId, amount, reason: 'weekly_complete_7days' },
      { httpsAgent, timeout: 10000 },
    );

    await this.prisma.pointTransaction.create({
      data: {
        userKey,
        weekStart,
        amount,
        reason: 'weekly_complete_7days',
        tossOrderId: data.orderId ?? orderId,
      },
    });
  }

  async getPointHistory(userKey: string) {
    const transactions = await this.prisma.pointTransaction.findMany({
      where: { userKey },
      orderBy: { grantedAt: 'desc' },
      take: 24, // 최근 24주
    });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalPoints: total,
      transactions: transactions.map((t) => ({
        weekStart: t.weekStart,
        amount: t.amount,
        reason: t.reason,
        grantedAt: t.grantedAt.toISOString(),
      })),
    };
  }
}
