import { FastifyInstance } from 'fastify';

import { NovloveController } from 'src/controller/novlove.controller.js';
import { NovloveRedisDebugController } from 'src/controller/novlove.debug.controller.js';
import {
  ChapterRequest,
  GenreRequest,
  NovelRequest,
  SortRequest,
} from 'src/model/novlove.model.js';

export default async function novloveRoute(fastify: FastifyInstance) {
  const novlove = NovloveController(fastify);
  const debug = NovloveRedisDebugController(fastify);

  fastify.get('/novlove', novlove.home);
  fastify.get<SortRequest>('/novlove/sort/:sort', novlove.sort);
  fastify.get<GenreRequest>('/novlove/genre/:genre', novlove.genre);
  fastify.get<NovelRequest>('/novlove/novel/:name', novlove.novel);
  fastify.get<ChapterRequest>('/novlove/novel/:name/:chapter', novlove.chapter);

  fastify.get('/novlove/debug/redis/home', debug.home);
  fastify.get('/novlove/debug/redis/sort', debug.sort);
  fastify.get('/novlove/debug/redis/genre', debug.genre);
  fastify.get('/novlove/debug/redis/detail', debug.detail);
}
