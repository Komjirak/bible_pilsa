import { Module } from '@nestjs/common';
import { DailyVerseController } from './daily-verse.controller';
import { DailyVerseService } from './daily-verse.service';

@Module({
  controllers: [DailyVerseController],
  providers: [DailyVerseService],
  exports: [DailyVerseService],
})
export class DailyVerseModule {}
