import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly httpService;
    private readonly prisma;
    private httpsAgent;
    constructor(httpService: HttpService, prisma: PrismaService);
    exchangeToken(authorizationCode: string, referrer: string): Promise<{
        token: string;
    }>;
}
