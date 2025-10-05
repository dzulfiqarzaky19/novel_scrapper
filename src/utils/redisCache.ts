import { FastifyInstance } from 'fastify';

export const redisCache = async <T>(
  fastify: FastifyInstance,
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
  isSkipCache?: boolean,
): Promise<T> => {
  if (isSkipCache) return fetcher();

  try {
    const cached = await fastify.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    fastify.log.warn({ err }, 'redis get failed, falling back to scrape');
  }

  const data = await fetcher();

  try {
    await fastify.redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    fastify.log.warn({ err }, 'redis set failed, continuing');
  }

  return data;
};
