import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { LogLevel } from '@nestjs/common';
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
  await app.listen(process.env.NODE_PORT ?? 3000);
}

bootstrap();
