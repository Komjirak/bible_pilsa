import { PrismaService } from '../prisma/prisma.service';
export interface ProgressData {
    sequentialIndex: number;
    completedDates: string[];
    randomOffset: number;
    totalPoints: number;
    pointHistory: {
        label: string;
        date: string;
        amount: number;
    }[];
}
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProgress(userKey: string): Promise<ProgressData>;
    saveProgress(userKey: string, data: Partial<ProgressData>): Promise<ProgressData>;
    private parseJson;
}
