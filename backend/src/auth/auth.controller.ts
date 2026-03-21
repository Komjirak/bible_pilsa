import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async exchangeToken(
    @Body('authorizationCode') authorizationCode: string,
    @Body('referrer') referrer: string,
  ) {
    if (!authorizationCode || !referrer) {
      throw new HttpException('Missing authorizationCode or referrer', HttpStatus.BAD_REQUEST);
    }
    return await this.authService.exchangeToken(authorizationCode, referrer);
  }
}
