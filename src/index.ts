// src/index.ts
import Fastify from 'fastify';
import puppeteerPlugin from './plugins/puppeteer/puppeteer.js';
import novelRoutes from './routes/novlove.js';

async function main() {
  const app = Fastify({ logger: true });

  // 1) Register plugin first (adds app.puppeteer)
  app.register(puppeteerPlugin);

  // 2) Then routes that use app.puppeteer
  app.register(novelRoutes, { prefix: '/api/novel' });

  app.get('/', async (_req, reply) => reply.send({ hello: 'world' }));

  await app.ready();
  app.log.info(`puppeteer decorated? ${Boolean((app as any).puppeteer)}`);

  const address = await app.listen({ port: 3000, host: '127.0.0.1' });
  console.log(`🚀 Server running on ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
