import { Module } from '@nestjs/common';
import { CompletionController } from './completion.controller';
import { CompletionService } from './completion.service';
import { WeeklyChallengeModule } from '../weekly-challenge/weekly-challenge.module';
import { PointModule } from '../point/point.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [WeeklyChallengeModule, PointModule],
  controllers: [CompletionController],
  providers: [CompletionService, PrismaService],
})
export class CompletionModule {}
