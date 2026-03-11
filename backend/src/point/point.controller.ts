import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { PointService } from './point.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  // GET /api/v1/points/history
  @Get('history')
  @UseGuards(JwtGuard)
  getHistory(@Request() req: any) {
    return this.pointService.getPointHistory(req.user.userKey);
  }

  // POST /api/v1/points/test/grant
  // 테스트용: 토스 프로모션 API 직접 호출 (7일 완주 우회)
  @Post('test/grant')
  @UseGuards(JwtGuard)
  async testGrant(@Request() req: any) {
    // 실제 유저 키를 넘겨야 Toss API가 성공합니다.
    const userKey = req.user.userKey;
    const testWeekStart = `test-week-${Date.now()}`;
    const result = await this.pointService.grantWeeklyCompletePoint(userKey, testWeekStart);
    
    // Toss API에서 에러가 반환된 경우
    if (result?.success === false) {
      return result;
    }

    return {
      success: true,
      message: '테스트 포인트 지급 API 호출 완료',
      grantedAmount: Number(process.env.WEEKLY_COMPLETE_POINT_AMOUNT ?? 10)
    };
  }
}
