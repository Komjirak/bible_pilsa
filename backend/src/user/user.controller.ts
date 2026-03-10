import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  })
  time?: string;

  @IsOptional()
  @IsString()
  fontSize?: string;
}

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/settings')
  async getSettings(@Request() req: any) {
    return this.userService.getUserSettings(req.user.userKey);
  }

  @Patch('me/notification')
  async updateNotification(
    @Request() req: any,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.userService.updateNotificationSettings(
      req.user.userKey,
      dto.enabled,
      dto.time,
      dto.fontSize,
    );
  }
}
