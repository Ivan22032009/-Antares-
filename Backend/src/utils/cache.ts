import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (client) return client;
  try {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    client = createClient({ url });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
    return client;
  } catch (err: any) {
    console.warn('Redis unavailable:', err?.message || err);
    client = null;
    return null;
  }
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const c = await getRedisClient();
  if (!c) return null;
  try {
    const val = await c.get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch (err) {
    console.warn('Redis get error', err);
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttlSec = 60): Promise<void> {
  const c = await getRedisClient();
  if (!c) return;
  try {
    await c.set(key, JSON.stringify(value), { EX: ttlSec });
  } catch (err) {
    console.warn('Redis set error', err);
  }
}

export async function cacheDel(key: string): Promise<void> {
  const c = await getRedisClient();
  if (!c) return;
  try {
    await c.del(key);
  } catch (err) {
    console.warn('Redis del error', err);
  }
}

export async function cacheDelPrefix(prefix: string): Promise<void> {
  const c = await getRedisClient();
  if (!c) return;
  try {
    const keys = await c.keys(`${prefix}*`);
    if (keys.length === 0) return;
    await c.del(keys);
  } catch (err) {
    console.warn('Redis del prefix error', err);
  }
}
