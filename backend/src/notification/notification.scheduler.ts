import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  // 매 분마다 실행
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const nowKST = dayjs().tz('Asia/Seoul');
    const currentTimeString = nowKST.format('HH:mm');
    
    this.logger.debug(`Checking notifications for time: ${currentTimeString}`);

    try {
      // 알림이 켜져있고, 시간이 현재 시간과 일치하는 유저 조회
      const usersToNotify = await this.prisma.user.findMany({
        where: {
          notificationEnabled: true,
          notificationTime: currentTimeString,
        },
        select: { userKey: true },
      });

      if (usersToNotify.length === 0) {
        return; // 알림 대상 없음
      }

      this.logger.log(`Found ${usersToNotify.length} users to notify at ${currentTimeString}`);

      // 비동기 병렬 발송 (실제 운영시 큐 사용 권장)
      const notifyPromises = usersToNotify.map((user) =>
        this.notificationService.sendSmartMessage(user.userKey, currentTimeString),
      );

      await Promise.allSettled(notifyPromises);
    } catch (error) {
      this.logger.error('Error during notification scheduler task', error);
    }
  }
}
