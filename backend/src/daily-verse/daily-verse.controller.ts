import { Controller, Get, UseGuards } from '@nestjs/common';
import { DailyVerseService } from './daily-verse.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('daily-verse')
@UseGuards(JwtGuard)
export class DailyVerseController {
  constructor(private readonly dailyVerseService: DailyVerseService) {}

  // GET /api/v1/daily-verse
  // 오늘의 말씀 구절 반환 (KST 기준)
  @Get()
  getTodayVerse() {
    return this.dailyVerseService.getTodayVerse();
  }
}
