import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

// Allow up to 10 requests every 60 seconds per IP address
export const scannerRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'ratelimit:scan-deps',
});
