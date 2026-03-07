import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, IsNotEmpty } from 'class-validator';

class TokenRequestDto {
  @IsString()
  @IsNotEmpty()
  authorizationCode: string;

  @IsString()
  @IsNotEmpty()
  referrer: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/token
  // 앱인토스 authorizationCode → JWT 교환
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async exchangeToken(@Body() dto: TokenRequestDto) {
    return this.authService.exchangeToken(dto.authorizationCode, dto.referrer);
  }
}
