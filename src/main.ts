import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logLevels: LogLevel[] = (() => {
    const level = process.env.LOG_LEVEL ?? 'info';
    if (level === 'debug') {
      // all levels enabled
      return ['log', 'error', 'warn', 'debug', 'verbose'];
    }
    return [level as LogLevel];
  })();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: logLevels,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.NODE_PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
