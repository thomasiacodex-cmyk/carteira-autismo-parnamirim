import { describe, it, expect, vi } from "vitest";
import { checkRateLimit, type RateLimitConfig } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within limit", () => {
    const config: RateLimitConfig = { maxRequests: 3, windowSeconds: 60 };
    const key = `test-${Date.now()}`;

    const r1 = checkRateLimit(key, config);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, config);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, config);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over limit", () => {
    const config: RateLimitConfig = { maxRequests: 2, windowSeconds: 60 };
    const key = `test-block-${Date.now()}`;

    checkRateLimit(key, config);
    checkRateLimit(key, config);

    const r3 = checkRateLimit(key, config);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("uses different keys independently", () => {
    const config: RateLimitConfig = { maxRequests: 1, windowSeconds: 60 };
    const key1 = `test-a-${Date.now()}`;
    const key2 = `test-b-${Date.now()}`;

    const r1 = checkRateLimit(key1, config);
    expect(r1.allowed).toBe(true);

    const r2 = checkRateLimit(key2, config);
    expect(r2.allowed).toBe(true);

    const r3 = checkRateLimit(key1, config);
    expect(r3.allowed).toBe(false);
  });
});
