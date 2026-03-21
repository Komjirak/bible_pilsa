import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    exchangeToken(authorizationCode: string, referrer: string): Promise<{
        token: string;
    }>;
}
