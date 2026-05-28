import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly httpService;
    private readonly prisma;
    private readonly jwtService;
    private httpsAgent;
    constructor(httpService: HttpService, prisma: PrismaService, jwtService: JwtService);
    exchangeToken(authorizationCode: string, referrer: string): Promise<{
        token: string;
    }>;
    private upsertAndSign;
}
