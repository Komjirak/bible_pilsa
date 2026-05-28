import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProgressData {
  sequentialIndex: number;
  completedDates: string[];
  randomOffset: number;
  totalPoints: number;
  pointHistory: { label: string; date: string; amount: number }[];
}

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userKey: string): Promise<ProgressData> {
    const user = await this.prisma.user.findUnique({ where: { userKey } });
    if (!user) {
      return { sequentialIndex: 0, completedDates: [], randomOffset: 0, totalPoints: 0, pointHistory: [] };
    }
    return {
      sequentialIndex: user.sequentialIndex,
      completedDates: this.parseJson(user.completedDates, []),
      randomOffset: user.randomOffset,
      totalPoints: user.totalPoints,
      pointHistory: this.parseJson(user.pointHistory, []),
    };
  }

  async saveProgress(userKey: string, data: Partial<ProgressData>): Promise<ProgressData> {
    const user = await this.prisma.user.upsert({
      where: { userKey },
      create: {
        userKey,
        sequentialIndex: data.sequentialIndex ?? 0,
        completedDates: JSON.stringify(data.completedDates ?? []),
        randomOffset: data.randomOffset ?? 0,
        totalPoints: data.totalPoints ?? 0,
        pointHistory: JSON.stringify(data.pointHistory ?? []),
      },
      update: {
        ...(data.sequentialIndex !== undefined && { sequentialIndex: data.sequentialIndex }),
        ...(data.completedDates !== undefined && { completedDates: JSON.stringify(data.completedDates) }),
        ...(data.randomOffset !== undefined && { randomOffset: data.randomOffset }),
        ...(data.totalPoints !== undefined && { totalPoints: data.totalPoints }),
        ...(data.pointHistory !== undefined && { pointHistory: JSON.stringify(data.pointHistory) }),
      },
    });
    return {
      sequentialIndex: user.sequentialIndex,
      completedDates: this.parseJson(user.completedDates, []),
      randomOffset: user.randomOffset,
      totalPoints: user.totalPoints,
      pointHistory: this.parseJson(user.pointHistory, []),
    };
  }

  private parseJson<T>(raw: string, fallback: T): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}
