import { FastifyInstance } from 'fastify';
import { NovloveController } from 'src/controller/novlove.controller.js';
import { NovloveRedisDebugController } from 'src/controller/novlove.debug.controller.js';
import { GenreRequest, SortRequest } from 'src/model/novlove.model.js';

export default async function novloveRoute(fastify: FastifyInstance) {
  const novlove = NovloveController(fastify);
  const novloveDebug = NovloveRedisDebugController(fastify);

  fastify.get('/novlove', novlove.home);
  fastify.get<SortRequest>('/novlove/sort/:sort', novlove.sort);
  fastify.get<GenreRequest>('/novlove/genre/:genre', novlove.genre);

  fastify.get('/novlove/debug/redis/home', novloveDebug.home);
  fastify.get('/novlove/debug/redis/sort', novloveDebug.sort);
  fastify.get('/novlove/debug/redis/genre', novloveDebug.genre);
}
