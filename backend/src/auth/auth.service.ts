import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
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

  private async fetchTossUserKey(code: string, referrer: string): Promise<string> {
    const endpoint = process.env.TOSS_TOKEN_ENDPOINT;
    const clientId = process.env.TOSS_CLIENT_ID;
    const clientSecret = process.env.TOSS_CLIENT_SECRET;

    if (!endpoint || !clientId || !clientSecret) {
      // 개발 환경 — mock
      this.logger.warn('[auth] 토스 OAuth2 env 미설정 — 개발 mock 사용');
      return `dev-user-${code.slice(0, 8)}`;
    }

    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: referrer,
        client_id: clientId,
        client_secret: clientSecret,
      });

      const { data } = await axios.post<TossTokenResponse>(endpoint, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 5000,
      });

      return data.userKey;
    } catch (err) {
      this.logger.error('[auth] 토스 OAuth2 토큰 교환 실패', err?.message);
      throw new UnauthorizedException('토스 인증에 실패했습니다');
    }
  }
}
