import { createJobScheduler } from '#scrapper/utils/jobScheduler.js';
import { FastifyInstance } from 'fastify';
import { SORT_CONFIG } from './listScrapper.config.js';
import fs from 'fs';
import { parseSortRow } from './listScrapper.parser.js';
import { evalOrEmpty } from '#scrapper/utils/evalManager.js';
import { normalizeList } from './listScrapper.normalizer.js';

const scheduler = createJobScheduler(1, 1200);

export const sortScrapper = async (
  fastify: FastifyInstance,
  listBy: string,
  listType: 'genre' | 'sort' = 'sort',
  query: string,
) => {
  return scheduler.addJob(async () => {
    const queryString = query === '1' ? '' : `?page=${query}`;
    const pageUrl = `${SORT_CONFIG[listType]}${listBy}${queryString}`;

    const page = await fastify.puppeteer.getPage(pageUrl, [
      SORT_CONFIG.selector,
    ]);

    try {
      const listRaw = await evalOrEmpty(
        page,
        SORT_CONFIG.selector,
        parseSortRow,
        SORT_CONFIG,
      );

      return {
        list: normalizeList(listRaw),
      };
    } finally {
      await page.close();
    }
  });
};
