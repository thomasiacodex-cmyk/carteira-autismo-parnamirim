/**
 * Simple in-memory rate limiter.
 * For production with multiple instances, replace with Redis-based solution.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  login: { maxRequests: 5, windowSeconds: 60 * 15 } as RateLimitConfig, // 5 per 15min
  register: { maxRequests: 3, windowSeconds: 60 * 60 } as RateLimitConfig, // 3 per hour
  passwordReset: { maxRequests: 3, windowSeconds: 60 * 60 } as RateLimitConfig, // 3 per hour
  upload: { maxRequests: 20, windowSeconds: 60 * 10 } as RateLimitConfig, // 20 per 10min
  admin: { maxRequests: 5, windowSeconds: 60 * 15 } as RateLimitConfig, // 5 per 15min
  api: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig, // 60 per minute
} as const;

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowSeconds * 1000,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract IP from request headers (works with proxies)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
