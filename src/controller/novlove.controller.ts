import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { homeScrapper } from '#scrapper/sites/novlove/home/homeScrapper.js';
import { redisCache } from '#utils/redisCache.js';
import { listScrapper } from '#scrapper/sites/novlove/list/listScrapper.js';

import { GenreRequest, SortRequest } from 'src/model/novlove.model.js';
import { NOVLOVE_CONFIG } from 'src/config/novlove.config.js';
import { detailScrapper } from '#scrapper/sites/novlove/detail/detailScrapper.js';

const list = {
  sort: 'sort',
  genre: 'genre',
} as const;

const defaultQueryPage = '1';

export const NovloveController = (fastify: FastifyInstance) => {
  const home = async (_: FastifyRequest, res: FastifyReply) => {
    const data = await redisCache(fastify, {
      key: NOVLOVE_CONFIG.home.redis_key,
      ttl: NOVLOVE_CONFIG.home.ttl_seconds,
      fetcher: () => homeScrapper(fastify),
    });

    return res.send(data);
  };

  const sort = async (req: FastifyRequest<SortRequest>, res: FastifyReply) => {
    const { sort } = req.params;
    const page = req.query.page ?? defaultQueryPage;

    const data = await redisCache(fastify, {
      key: NOVLOVE_CONFIG.sort.redis_key,
      ttl: NOVLOVE_CONFIG.sort.ttl_seconds,
      fetcher: () =>
        listScrapper(fastify, {
          listBy: sort,
          listType: list.sort,
          query: page,
        }),
      isSkipCache: page !== defaultQueryPage,
    });

    return res.send(data);
  };

  const genre = async (
    req: FastifyRequest<GenreRequest>,
    res: FastifyReply,
  ) => {
    const { genre } = req.params;
    const page = req.query.page ?? defaultQueryPage;

    const data = await redisCache(fastify, {
      key: NOVLOVE_CONFIG.genre.redis_key,
      ttl: NOVLOVE_CONFIG.genre.ttl_seconds,
      fetcher: () =>
        listScrapper(fastify, {
          listBy: genre,
          listType: list.genre,
          query: page,
        }),
      isSkipCache: page !== defaultQueryPage,
    });

    return res.send(data);
  };

  const novel = async (
    req: FastifyRequest<{ Params: { novel: string } }>,
    res: FastifyReply,
  ) => {
    const { novel } = req.params;

    const data = await redisCache(fastify, {
      key: NOVLOVE_CONFIG.detail.redis_key,
      ttl: NOVLOVE_CONFIG.detail.ttl_seconds,
      fetcher: () => detailScrapper(fastify, novel),
    });

    return res.send(data);
  };

  const chapter = async (req: FastifyRequest, res: FastifyReply) => {
    const { name } = req.params;

    const data = detailScrapper(fastify, name);

    return res.send(data);
  };

  return { home, sort, genre, novel, chapter };
};
