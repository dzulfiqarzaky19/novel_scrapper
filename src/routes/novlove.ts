import { FastifyInstance } from 'fastify';
import { homeScrapper } from '../scrapper/sites/novlove/home/homeScrapper.js';
import { redisCache } from '../utils/redisCache.js';
import { sortScrapper } from '#scrapper/sites/novlove/sorts/listScrapper.js';

const NOVLOVE_CONFIG = {
  home: {
    redis_key: 'novlove:home:v1',
    ttl_seconds: 60 * 60,
  },
  sort: {
    redis_key: 'novlove:sort:v1',
    ttl_seconds: 2 * 60 * 60,
  },
  genre: {
    redis_key: 'novlove:genre:v1',
    ttl_seconds: 6 * 60 * 60,
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

  fastify.get('/novlove/debug/redis/home', async (req, reply) => {
    const data = await fastify.redis.get(NOVLOVE_CONFIG.home.redis_key);

    return data ? JSON.parse(data) : { msg: 'no cache' };
  });

  fastify.get<{ Params: { sort: string }; Querystring: { page: string } }>(
    '/novlove/sort/:sort',
    async (req, reply) => {
      const { sort } = req.params;
      const page = req.query.page ?? '1';

      const data = await redisCache(
        fastify,
        NOVLOVE_CONFIG.sort.redis_key,
        NOVLOVE_CONFIG.sort.ttl_seconds,
        () => sortScrapper(fastify, sort, 'sort', page),
        page !== '1',
      );

      return reply.send(data);
    },
  );

  fastify.get('/novlove/debug/redis/sort', async (req, reply) => {
    const data = await fastify.redis.get(NOVLOVE_CONFIG.sort.redis_key);

    return data ? JSON.parse(data) : { msg: 'no cache' };
  });

  fastify.get<{
    Params: { genre: string };
    Querystring: { page: string };
  }>('/novlove/genre/:genre', async (req, reply) => {
    const { genre } = req.params;
    const page = req.query.page ?? '1';

    const data = await redisCache(
      fastify,
      NOVLOVE_CONFIG.genre.redis_key,
      NOVLOVE_CONFIG.genre.ttl_seconds,
      () => sortScrapper(fastify, genre, 'genre', page),
      page !== '1',
    );

    return reply.send(data);
  });

  fastify.get('/novlove/debug/redis/genre', async (req, reply) => {
    const data = await fastify.redis.get(NOVLOVE_CONFIG.genre.redis_key);

    return data ? JSON.parse(data) : { msg: 'no cache' };
  });
}
