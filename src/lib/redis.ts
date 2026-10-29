import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://your-database-id.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'your_upstash_rest_token',
});
