import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      // Setting log level based on environment variable or default to 'info'
      level: process.env.LOG_LEVEL || 'info',
      // Specify default meta data to be added to each log
      defaultMeta: { service: 'user-service' },
      // Format for log messages
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // Ensures stack trace is captured
        winston.format.splat(),
        winston.format.json(),
      ),
      // Configuring transports (destinations for logging)
      transports: [
        // Console Transport Configuration
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
            ),
          ),
        }),
        // Daily Rotate File Transport Configuration
        new DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          dirname: process.env.LOG_DIR || './logs',
        }),
      ],
      // Silence all logs in test environment
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  exports: [WinstonModule], // Export WinstonModule to make it injectable in other modules
})
export class LoggerModule {}
