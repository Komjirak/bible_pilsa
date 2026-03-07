import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DailyVerseModule } from './daily-verse/daily-verse.module';
import { CompletionModule } from './completion/completion.module';
import { WeeklyChallengeModule } from './weekly-challenge/weekly-challenge.module';
import { PointModule } from './point/point.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate Limit: 60초 내 30회 (기본)
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL) * 1000 || 60000,
        limit: Number(process.env.THROTTLE_LIMIT) || 30,
      },
    ]),

    AuthModule,
    DailyVerseModule,
    CompletionModule,
    WeeklyChallengeModule,
    PointModule,
    UserModule,
    NotificationModule,
  ],
})
export class AppModule {}
