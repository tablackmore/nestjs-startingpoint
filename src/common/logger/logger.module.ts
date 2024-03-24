import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

// Create the logger instance
export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            `${timestamp} ${level}: ${message}`,
        ),
      ),
    }),
    // Additional transports or configuration as needed
  ],
});

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      // Logger for NestJS context, setup here; though we're using the exported instance.
      level: process.env.LOG_LEVEL || 'info',
      // Specify the default Meta data to be added to each log
      defaultMeta: { service: 'user-service' },
      // Format of the log message
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }), // Properly log error stacks
        winston.format.json(),
      ),
      // Transports (where to log)
      transports: [
        // Console Transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
            ),
          ),
        }),
        // Daily Rotate File Transport
        new DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          dirname: process.env.LOG_DIR || 'logs',
        }),
      ],
      // Optionally: Silence all logs (useful in testing environments)
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  exports: [WinstonModule], // Export WinstonModule if you want to inject the logger into your services
})
export class LoggerModule {}
