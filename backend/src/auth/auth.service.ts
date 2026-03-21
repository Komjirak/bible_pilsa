import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private httpsAgent: https.Agent;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {
    // Note: Certificates should be mounted securely in production environments
    // Using dummy paths here; these should be replaced by actual paths from process.env
    const certPath = process.env.TOSS_CERT_PATH || path.join(process.cwd(), 'certs', 'client.crt');
    const keyPath = process.env.TOSS_KEY_PATH || path.join(process.cwd(), 'certs', 'client.key');

    try {
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        this.httpsAgent = new https.Agent({
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
          rejectUnauthorized: false, // Often true in prod, but false might be needed depending on Toss environment
        });
      }
    } catch (e) {
      console.error('Failed to load certificates for mTLS:', e);
    }
  }

  async exchangeToken(authorizationCode: string, referrer: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api-partner.toss.im/v1/apps-in-toss/user/oauth2/generate-token',
          { authorizationCode, referrer },
          { httpsAgent: this.httpsAgent }
        )
      );

      const data = response.data;
      const userKey = data.userKey; // Assuming token response contains userKey or we need to call /login-me

      // Store or update user in our database
      if (userKey) {
          await this.prisma.user.upsert({
            where: { userKey },
            update: {},
            create: { userKey },
          });
      }

      // Normally, create internal JWT here, but returning dummy token for scaffold
      return { token: 'dummy_jwt_token_for_' + userKey };
    } catch (error: any) {
      console.error('Toss Token Exchange Error:', error?.response?.data || error.message);
      throw new HttpException('Token exchange failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
