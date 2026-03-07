import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 7일 완주 포인트 지급 (토스 executePromotion API)
  async grantWeeklyCompletePoint(userKey: string, weekStart: string): Promise<void> {
    const amount = Number(process.env.WEEKLY_COMPLETE_POINT_AMOUNT ?? 10);
    const promotionCode = process.env.TOSS_PROMOTION_CODE; // 발급받은 프로모션 코드
    const apiKey = process.env.TOSS_PROMOTION_API_KEY; // 보상 지급 API Key
    
    // Toss executePromotion URL
    const apiUrl = 'https://api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion';

    if (!promotionCode || !apiKey) {
      // 개발 환경 — mock
      this.logger.warn(`[point] 프로모션 발급 환경변수 미설정 — 포인트 지급 mock: userKey=${userKey} amount=${amount}`);
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

    // 중복 지급 방지용 고유 지급 키 (고유해야 함)
    const rewardKey = `bp-reward-${userKey.slice(0, 8)}-${weekStart}`;

    try {
      const { data } = await axios.post(
        apiUrl,
        { 
          promotionCode, 
          key: rewardKey, 
          amount 
        },
        { 
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'x-toss-user-key': userKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000 
        },
      );

      await this.prisma.pointTransaction.create({
        data: {
          userKey,
          weekStart,
          amount,
          reason: 'weekly_complete_7days',
          tossOrderId: rewardKey,
        },
      });

      this.logger.log(`[point] executePromotion 성공: userKey=${userKey} rewardKey=${rewardKey}`);
    } catch (err) {
      this.logger.error(`[point] executePromotion 실패: userKey=${userKey}`, err?.response?.data || err?.message);
      throw err;
    }
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
