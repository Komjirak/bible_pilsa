import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PointController],
  providers: [PointService, PrismaService],
  exports: [PointService],
})
export class PointModule {}
