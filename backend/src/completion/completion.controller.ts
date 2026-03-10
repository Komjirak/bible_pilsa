import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompletionService } from './completion.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

class CompleteRequestDto {
  @IsString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD (KST)

  @IsString()
  @IsNotEmpty()
  verseRef: string;

  @IsString()
  @IsNotEmpty()
  userInput: string; // 사용자 입력 전문 (서버사이드 검증용)

  @IsNumber()
  @Min(0)
  @Max(600000)
  durationMs: number; // 필사 소요 시간 (ms, Fraud 감지용)
}

@Controller('complete')
@UseGuards(JwtGuard)
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  // POST /api/v1/complete
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async complete(@Request() req: any, @Body() dto: CompleteRequestDto) {
    return this.completionService.submitCompletion(req.user.userKey, dto);
  }
}
