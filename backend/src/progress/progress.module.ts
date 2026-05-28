import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'komjirak-bible-secret',
    }),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
