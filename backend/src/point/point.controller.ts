import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PointService } from './point.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('points')
@UseGuards(JwtGuard)
export class PointController {
  constructor(private readonly pointService: PointService) {}

  // GET /api/v1/points/history
  @Get('history')
  getHistory(@Request() req: any) {
    return this.pointService.getPointHistory(req.user.userKey);
  }
}
