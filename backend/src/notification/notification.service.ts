import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendSmartMessage(userKey: string, timeString: string) {
    const endpoint = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/messenger/send-message';
    const templateSetCode = 'bible_pilsa_reminder'; // Toss 콘솔에 등록된 템플릿 코드

    try {
      this.logger.log(`[Push] Sending to user ${userKey} for time ${timeString}`);
      
      // mTLS 인증서 로드
      let httpsAgent: https.Agent | undefined;
      const certPath = './certs/toss-public.crt';
      const keyPath = './certs/toss-private.key';
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        httpsAgent = new https.Agent({
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        });
      } else {
        this.logger.warn('[Push] mTLS certificates not found. Using Mock mode.');
        return true; // 개발 환경 임시 허용
      }

      const { data } = await axios.post(
        endpoint,
        {
          templateSetCode,
          context: {
            time: timeString, // 템플릿 내 {{time}} 변수 치환
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Toss-User-Key': userKey,
          },
          httpsAgent,
          timeout: 5000,
        },
      );

      this.logger.log(`[Push] result for ${userKey}: ${data.resultType}`);
      return data.resultType === 'SUCCESS';
    } catch (err: any) {
      const errorMsg = err?.response?.data || err.message;
      this.logger.error(`[Push] Failed for ${userKey}: ${JSON.stringify(errorMsg)}`);
      return false;
    }
  }
}
