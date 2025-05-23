import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/config-validation.schema';
import { RedisModule } from './modules/cache/redis/redis.module';
import { HashKey } from './enums/hash-key.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TripModule } from './modules/trip/trip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
          password: configService.get('REDIS_PASSWORD'),
          patternToClean: HashKey.PATTERN_CLEAN_ALL,
        };
      },
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
      {
        dbName: process.env.DATABASE_NAME,
      },
    ),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule], // import the module that provides ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: ApolloDriver,
        autoSchemaFile: true,
        playground: configService.get('GRAPHQL_PLAYGROUND') === 'true',
      }),
    }),
    TripModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
