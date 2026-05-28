import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  private httpsAgent: https.Agent | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    const certPath = process.env.TOSS_CERT_PATH || path.join(process.cwd(), 'certs', 'client.crt');
    const keyPath = process.env.TOSS_KEY_PATH || path.join(process.cwd(), 'certs', 'client.key');
    try {
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        this.httpsAgent = new https.Agent({
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        });
      }
    } catch (e) {
      console.error('[auth] mTLS 인증서 로드 실패:', e);
    }
  }

  async exchangeToken(authorizationCode: string, referrer: string): Promise<{ token: string }> {
    // 개발 환경 mock
    if (process.env.NODE_ENV !== 'production' && authorizationCode.startsWith('mock-')) {
      const userKey = `dev-user-mock`;
      return this.upsertAndSign(userKey);
    }

    try {
      // 1) Toss 토큰 발급
      const tokenRes = await firstValueFrom(
        this.httpService.post(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
          { authorizationCode, referrer },
          { httpsAgent: this.httpsAgent, timeout: 5000 },
        ),
      );

      const tossAccessToken: string | undefined =
        tokenRes.data?.success?.accessToken ?? tokenRes.data?.accessToken;
      if (!tossAccessToken) {
        throw new Error('Toss 토큰 발급 실패: ' + JSON.stringify(tokenRes.data));
      }

      // 2) userKey 조회
      const meRes = await firstValueFrom(
        this.httpService.get(
          'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me',
          {
            headers: { Authorization: `Bearer ${tossAccessToken}` },
            httpsAgent: this.httpsAgent,
            timeout: 5000,
          },
        ),
      );

      const userKey: string | undefined =
        (meRes.data?.success?.userKey ?? meRes.data?.userKey)?.toString();
      if (!userKey) {
        throw new Error('userKey 조회 실패: ' + JSON.stringify(meRes.data));
      }

      return this.upsertAndSign(userKey);
    } catch (err: any) {
      console.error('[auth] Toss 인증 실패:', err?.response?.data || err?.message);
      // mTLS 없을 때 fallback (개발/테스트)
      if (!this.httpsAgent) {
        const fallbackKey = `dev-user-${authorizationCode.slice(0, 8)}`;
        return this.upsertAndSign(fallbackKey);
      }
      throw new HttpException('인증에 실패했습니다.', HttpStatus.UNAUTHORIZED);
    }
  }

  private async upsertAndSign(userKey: string): Promise<{ token: string }> {
    await this.prisma.user.upsert({
      where: { userKey },
      create: { userKey },
      update: {},
    });
    const token = this.jwtService.sign({ userKey, sub: userKey });
    return { token };
  }
}
