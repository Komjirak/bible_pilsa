import { Controller, Get, UseGuards, Query } from '@nestjs/common';
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

  // GET /api/v1/daily-verse/sequential
  // 인덱스 기반 특정 말씀 구절 반환 (순서대로 필사 모드용)
  // 퍼블릭 데이터이므로 인증 없이도 접근 가능하게 설계함 (현재 컨트롤러는 JwtGuard 있으나,
  // 프론트엔드가 자체적으로 로그인 상태일 때 해당 토큰을 넘기므로 동일하게 처리 가능)
  @Get('sequential')
  getVerseByIndex(@Query('index') indexStr: string) {
    const index = parseInt(indexStr || '0', 10);
    return this.dailyVerseService.getVerseByIndex(index);
  }
}
