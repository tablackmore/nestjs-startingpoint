import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElearningModule } from './elearning/elearning.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ElearningModule,
  ],
})
export class AppModule {}
