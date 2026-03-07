import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendSmartMessage(userKey: string, timeString: string) {
    const endpoint = 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/messenger/send-message';
    const templateSetCode = 'bible_pilsa_reminder'; // TODO: 실제 템플릿 코드로 변경

    try {
      this.logger.log(`Sending push to user ${userKey} for time ${timeString}`);
      
      // 실제 토스 환경변수가 없는 개발 환경에서는 모킹 처리
      if (!process.env.TOSS_CLIENT_ID || process.env.TOSS_CLIENT_ID.startsWith('dev')) {
        this.logger.log(`[Mock] Push sent successfully to ${userKey} (${timeString})`);
        return true;
      }

      const { data } = await axios.post(
        endpoint,
        {
          templateSetCode,
          context: {
            time: timeString,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Toss-User-Key': userKey,
          },
          timeout: 5000,
        },
      );

      this.logger.log(`Push API result for ${userKey}: ${data.resultType}`);
      return data.resultType === 'SUCCESS';
    } catch (err: any) {
      this.logger.error(
        `Failed to send push to ${userKey}: ${err?.response?.data?.error?.message || err.message}`,
      );
      return false;
    }
  }
}
