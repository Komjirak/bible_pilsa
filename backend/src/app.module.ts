import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DailyVerseModule } from './daily-verse/daily-verse.module';

@Module({
  imports: [PrismaModule, AuthModule, DailyVerseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
