import { Logger, Provider } from '@nestjs/common';
import { useAdapter } from '@type-cacheable/ioredis-adapter';
import Redis from 'ioredis';
import { RedisConnectOptions, RedisConnectOptionsAsync } from '../interfaces/redis-connect-options';

const RedisConnection = 'RedisConnection';
// Note, log and debug are in JSON.stringify to prevent formatting objects on the console
const logger = new Logger(RedisConnection);

export function getRedisAsyncConnectionProvider(options: RedisConnectOptionsAsync): Provider {
  return {
    inject: options.inject,
    provide: RedisConnection,
    useFactory: async (...args: any[]): Promise<Redis> => {
      const connectOptions = await options.useFactory(...args);
      return connect(connectOptions);
    },
  };
}

function connect(options: RedisConnectOptions): Redis {
  const redisInstance = new Redis({
    host: options.host,
    port: Number(options.port),
    password: options.password,
    enableOfflineQueue: false,
    retryStrategy(times) {
      return Math.min(times * 60 * 1000, 5 * 60 * 1000);
    },
  });

  redisInstance.on('error', (err: Error) => {
    logger.error(`Error on Redis instance`, err);
  });

  redisInstance.on('reconnecting', () => {
    logger.debug(`Reconnecting to Redis instance`);
  });

  redisInstance.on('connect', () => {
    logger.debug(`Connected to Redis instance`);
  });

  redisInstance.on('ready', () => {
    logger.debug(`Redis ready for operations`);
    cleanCache(redisInstance, options);
    useAdapter(redisInstance);
  });

  redisInstance.on('pmessage', (args) => {
    logger.debug(`pmessage event ${args}`);
  });

  return redisInstance;
}

function cleanCache(redisInstance: Redis, options: RedisConnectOptions): void {
  if (!options.patternToClean) return;

  logger.debug(`Started cleaning for pattern ${options.patternToClean}`);

  const stream = redisInstance.scanStream({
    match: options.patternToClean,
  });
  stream.on('data', (keys: string[]) => {
    void (async () => {
      if (keys.length) {
        const pipeline = redisInstance.pipeline();
        pipeline.unlink(...keys);
        await pipeline.exec();
      }
    })();
  });

  stream.on('end', function () {
    logger.debug(`Cleaning done for pattern ${options.patternToClean}`);
  });
}
