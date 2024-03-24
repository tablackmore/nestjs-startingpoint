import { Module } from '@nestjs/common';
import { ElearningService } from './elearning.service';
import { ElearningController } from './elearning.controller';

@Module({
  providers: [ElearningService],
  controllers: [ElearningController],
})
export class ElearningModule {}
