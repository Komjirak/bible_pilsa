import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService implements OnModuleInit {
    readonly user: PrismaClient['user'];
    readonly weeklyChallenge: PrismaClient['weeklyChallenge'];
    readonly pointHistory: PrismaClient['pointHistory'];
    private readonly _client;
    constructor();
    onModuleInit(): Promise<void>;
}
