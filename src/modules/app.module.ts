import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElearningModule } from './elearning/elearning.module';

@Module({
  imports: [ConfigModule.forRoot(), ElearningModule],
})
export class AppModule {}
