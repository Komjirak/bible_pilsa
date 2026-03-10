import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSettings(userKey: string) {
    const user = await this.prisma.user.findUnique({
      where: { userKey },
      select: { notificationEnabled: true, notificationTime: true, fontSize: true },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateNotificationSettings(
    userKey: string,
    enabled?: boolean,
    time?: string,
    fontSize?: string,
  ) {
    const data: any = {};
    if (enabled !== undefined) data.notificationEnabled = enabled;
    if (time !== undefined) data.notificationTime = time;
    if (fontSize !== undefined) data.fontSize = fontSize;

    const user = await this.prisma.user.update({
      where: { userKey },
      data,
      select: { notificationEnabled: true, notificationTime: true, fontSize: true },
    });

    return user;
  }
}
