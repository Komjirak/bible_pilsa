import { Module } from '@nestjs/common';
import { WeeklyChallengeController } from './weekly-challenge.controller';
import { WeeklyChallengeService } from './weekly-challenge.service';
import { PointModule } from '../point/point.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PointModule],
  controllers: [WeeklyChallengeController],
  providers: [WeeklyChallengeService, PrismaService],
  exports: [WeeklyChallengeService],
})
export class WeeklyChallengeModule {}
