import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ProgressService, ProgressData } from './progress.service';

@Controller('api/v1/progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@Request() req: any): Promise<ProgressData> {
    return this.progressService.getProgress(req.userKey);
  }

  @Post()
  saveProgress(
    @Request() req: any,
    @Body() body: Partial<ProgressData>,
  ): Promise<ProgressData> {
    return this.progressService.saveProgress(req.userKey, body);
  }
}
