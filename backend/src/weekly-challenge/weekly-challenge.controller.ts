import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WeeklyChallengeService } from './weekly-challenge.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('weekly-status')
@UseGuards(JwtGuard)
export class WeeklyChallengeController {
  constructor(private readonly service: WeeklyChallengeService) {}

  // GET /api/v1/weekly-status
  @Get()
  getWeeklyStatus(@Request() req: any) {
    return this.service.getWeeklyStatus(req.user.userKey);
  }
}
