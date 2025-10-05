import { FastifyInstance } from 'fastify';
import { homeScrapper } from '../scrapper/sites/novlove/home/homeScrapper.js';
import { redisCache } from '../utils/redisCache.js';

const NOVLOVE_CONFIG = {
  home: {
    redis_key: 'novlove:home:v1',
    ttl_seconds: 60 * 60,
  },
} as const;

export default async function novloveRoute(fastify: FastifyInstance) {
  fastify.get('/novlove', async (_, reply) => {
    const data = await redisCache(
      fastify,
      NOVLOVE_CONFIG.home.redis_key,
      NOVLOVE_CONFIG.home.ttl_seconds,
      () => homeScrapper(fastify),
    );

    return reply.send(data);
  });

  fastify.get('/novlove/debug/redis', async (req, reply) => {
    const data = await fastify.redis.get(NOVLOVE_CONFIG.home.redis_key);

    return data ? JSON.parse(data) : { msg: 'no cache' };
  });
}
