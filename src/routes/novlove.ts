import { FastifyInstance } from 'fastify';
import { homeScrapper } from '../scrapper/sites/novlove/home/homeScrapper.js';

export default async function novloveRoute(fastify: FastifyInstance) {
  fastify.get('/novlove', async (_, reply) => {
    const data = await homeScrapper(fastify); // ✅ pass app
    return reply.send(data);
  });
}
