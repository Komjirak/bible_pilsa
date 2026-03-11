import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as https from 'https';
import { PrismaService } from '../prisma/prisma.service';

interface TossTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  userKey: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async exchangeToken(authorizationCode: string, referrer: string): Promise<{ accessToken: string }> {
    // 1) 토스 OAuth2 서버에서 userKey 획득
    const userKey = await this.fetchTossUserKey(authorizationCode, referrer);

    // 2) DB에 사용자 upsert
    await this.prisma.user.upsert({
      where: { userKey },
      create: { userKey },
      update: {},
    });

    // 3) 내부 JWT 발급
    const accessToken = this.jwtService.sign({ sub: userKey, userKey });
    return { accessToken };
  }

  private async fetchTossUserKey(authorizationCode: string, referrer: string): Promise<string> {
    const isMockAuth = process.env.NODE_ENV === 'development' && authorizationCode.startsWith('mock-');
    if (isMockAuth) {
      this.logger.warn('[auth] 개발 환경 Mock 로그인 감지');
      return `dev-user-mock`;
    }

    // 파일 시스템에서 mTLS 인증서 로드 (Auth & Point 둘다 쓰임)
    let httpsAgent: https.Agent | undefined;
    try {
      const certPath = './certs/toss-public.crt';
      const keyPath = './certs/toss-private.key';
      
      const fs = require('fs');
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        httpsAgent = new https.Agent({
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        });
      }
    } catch (err) {
      this.logger.error('[auth] mTLS 인증서 로드 실패', err);
    }

    try {
      // 1) 토큰 발급 API (mTLS 필요, Client ID/Secret 불필요)
      const tokenUrl = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token';
      const { data: tokenData } = await axios.post(
        tokenUrl,
        {
          authorizationCode,
          referrer
        },
        {
          headers: { 'Content-Type': 'application/json' },
          httpsAgent,
          timeout: 5000,
        }
      );

      if (tokenData?.resultType !== 'SUCCESS' || !tokenData?.success?.accessToken) {
        throw new Error(`generate-token 응답 실패: ${JSON.stringify(tokenData)}`);
      }

      const accessToken = tokenData.success.accessToken;

      // 2) 사용자 정보 조회 API -> userKey 획득 
      const meUrl = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me';
      const { data: meData } = await axios.get(
        meUrl,
        {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json' 
          },
          httpsAgent,
          timeout: 5000,
        }
      );

      if (meData?.resultType !== 'SUCCESS' || !meData?.success?.userKey) {
        throw new Error(`login-me 응답 실패: ${JSON.stringify(meData)}`);
      }

      return meData.success.userKey.toString();

    } catch (err: any) {
      this.logger.error('[auth] 토스 OAuth2 토큰 교환/사용자 조회 실패', err?.response?.data || err?.message);
      
      // 혹시라도 서버 인증서 이슈나 토큰 오류 시 임시 구제(테스트용)
      if (!httpsAgent) {
        this.logger.warn('[auth] mTLS 인증서가 없으므로 mock userKey 발급합니다.');
        return `dev-user-${authorizationCode.slice(0, 8)}`;
      }

      throw new UnauthorizedException('토스 인증에 실패했습니다');
    }
  }
}
