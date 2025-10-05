import { FastifyInstance } from 'fastify';

import { createJobScheduler } from '#scrapper/utils/jobScheduler.js';
import { evalOrEmpty } from '#scrapper/utils/evalManager.js';

import { HOME_CONFIG } from './homeScrapper.config.js';
import {
  parseCompleted,
  parseGenres,
  parseHot,
  parseLatest,
  parseSorts,
} from './homeScrapper.parser.js';
import {
  normalizeCompleted,
  normalizedGenres,
  normalizedSorts,
  normalizeHot,
  normalizeLatest,
} from './homeScrapper.normalizers.js';

const scheduler = createJobScheduler(1, 1200);

export const homeScrapper = async (fastify: FastifyInstance) => {
  return scheduler.addJob(async () => {
    const page = await fastify.puppeteer.getPage(HOME_CONFIG.url, [
      HOME_CONFIG.hot.selector,
      HOME_CONFIG.latest.selector,
      HOME_CONFIG.completed.selector,
      HOME_CONFIG.genres.selector,
      HOME_CONFIG.sorts.selector,
    ]);

    try {
      const [hotRaw, latestRaw, completedRaw, genresRaw, sortsRaw] =
        await Promise.all([
          evalOrEmpty(
            page,
            HOME_CONFIG.hot.selector,
            parseHot,
            HOME_CONFIG.hot,
          ),
          evalOrEmpty(
            page,
            HOME_CONFIG.latest.selector,
            parseLatest,
            HOME_CONFIG.latest,
          ),
          evalOrEmpty(
            page,
            HOME_CONFIG.completed.selector,
            parseCompleted,
            HOME_CONFIG.completed,
          ),
          evalOrEmpty(
            page,
            HOME_CONFIG.genres.selector,
            parseGenres,
            HOME_CONFIG.genres,
          ),
          evalOrEmpty(
            page,
            HOME_CONFIG.sorts.selector,
            parseSorts,
            HOME_CONFIG.sorts,
          ),
        ]);

      return {
        hot: normalizeHot(hotRaw),
        latest: normalizeLatest(latestRaw),
        completed: normalizeCompleted(completedRaw),
        genres: normalizedGenres(genresRaw),
        sorts: normalizedSorts(sortsRaw),
      };
    } finally {
      await page.close();
    }
  });
};
