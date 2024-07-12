import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

const PUB_SUB = 'PUB_SUB';
const pubSubProvider = {
  provide: PUB_SUB,
  useFactory: () => {
    const options = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    };

    const pubSub = new RedisPubSub({
      publisher: new Redis.Redis(options),
      subscriber: new Redis.Redis(options),
    });

    return pubSub;
  },
};

@Global()
@Module({
  imports: [],
  providers: [pubSubProvider],
  exports: [pubSubProvider],
})
export class RedisPubSubModule {}
