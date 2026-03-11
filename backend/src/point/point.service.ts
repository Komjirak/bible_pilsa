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
  async grantWeeklyCompletePoint(userKey: string, weekStart: string): Promise<any> {
    const amount = Number(process.env.WEEKLY_COMPLETE_POINT_AMOUNT ?? 10);
    const promotionCode = process.env.TOSS_PROMOTION_CODE; // 발급받은 프로모션 코드
    
    if (!promotionCode) {
      this.logger.warn(`[point] 프로모션 발급 환경변수 미설정 — 포인트 지급 개발 mock 처리: userKey=${userKey} amount=${amount}`);
      await this.prisma.pointTransaction.create({
        data: {
          userKey,
          weekStart,
          amount,
          reason: 'weekly_complete_7days',
          tossOrderId: `mock-${Date.now()}`,
        },
      });
      return { success: true, message: 'Mock 포인트 지급', grantedAmount: amount };
    }

    // 파일 시스템에서 mTLS 인증서 로드 (토스 서버 간 인증용, 별도의 API Key는 불필요)
    let httpsAgent: https.Agent | undefined;
    try {
      const certPath = './certs/toss-public.crt';
      const keyPath = './certs/toss-private.key';
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        httpsAgent = new https.Agent({
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        });
        this.logger.log(`[point] mTLS 인증서 로드 완료 (${certPath}, ${keyPath})`);
      } else {
        this.logger.warn('[point] mTLS 인증서가 없습니다. API 호출이 실패할 수 있습니다.');
      }
    } catch (err) {
      this.logger.error('[point] mTLS 인증서 로드 중 오류 발생', err);
    }

    try {
      // API 1단계: 프로모션 리워드 지급 Key 생성하기
      const getKeyUrl = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion/get-key';
      const { data: keyData } = await axios.post(
        getKeyUrl,
        {}, // body는 비워둡니다
        { 
          headers: {
            'x-toss-user-key': userKey,
            'Content-Type': 'application/json',
          },
          httpsAgent,
          timeout: 10000 
        }
      );

      if (keyData?.resultType !== 'SUCCESS' || !keyData?.success?.key) {
        throw new Error(`get-key 실패: ${JSON.stringify(keyData)}`);
      }
      
      const paymentKey = keyData.success.key;
      this.logger.log(`[point] 1단계 get-key 성공: paymentKey=${paymentKey}`);

      // API 2단계: 프로모션 리워드 실제 지급하기
      const executeUrl = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/promotion/execute-promotion';
      const { data: executeData } = await axios.post(
        executeUrl,
        { 
          promotionCode, 
          key: paymentKey, 
          amount 
        },
        { 
          headers: {
            'x-toss-user-key': userKey,
            'Content-Type': 'application/json',
          },
          httpsAgent,
          timeout: 10000 
        }
      );

      if (executeData?.resultType !== 'SUCCESS') {
        throw new Error(`execute-promotion 실패: ${JSON.stringify(executeData)}`);
      }

      this.logger.log(`[point] 2단계 executePromotion 성공: userKey=${userKey}`);

      // DB 저장 (성공 시)
      try {
        await this.prisma.pointTransaction.create({
          data: {
            userKey,
            weekStart,
            amount,
            reason: 'weekly_complete_7days',
            tossOrderId: paymentKey,
          },
        });
      } catch (dbErr) {
        this.logger.warn(`[point] DB 기록 실패 (가벼운 무시): ${dbErr}`);
      }

      return { success: true, message: '토스 API 지급 성공', grantedAmount: amount };
    } catch (err: any) {
      const tossError = err?.response?.data || err?.message;
      this.logger.error(`[point] 프로모션 지급 API 실패: userKey=${userKey}`, tossError);
      
      return {
        success: false,
        message: `토스 API 에러: ${JSON.stringify(tossError)}`,
        tossError,
      };
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
