import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElearningModule } from './elearning/elearning.module';
import { LoggerModule } from '../common/logger/logger.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    ElearningModule,
  ],
})
export class AppModule {}
