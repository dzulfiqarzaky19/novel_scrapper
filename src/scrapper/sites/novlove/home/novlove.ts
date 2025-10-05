import { withNewPage } from '../../../pageManager.js';
import { createJobScheduler } from '../../../utils/jobScheduler.js';

const scrapingJobScheduler = createJobScheduler(1, 1200);

export const NOVLOVE_HOME = {
  url: 'https://novlove.com/',

  hot: {
    selector: '#index-novel-hot .item a',
    titleAttr: 'title',
    coverSelector: 'img',
    coverAttr: 'data-src',
  },

  latest: {
    selector: '#novel-list-index .row',
    titleSelector: '.col-title a',
    genreSelector: '.col-genre a',
    chapterSelector: '.col-chap a',
    updatedSelector: '.col-time',
  },

  completed: {
    selector: '#index-novel-completed .col-xs-4 a',
    titleAttr: 'title',
    coverSelector: 'img',
    coverAttr: 'data-src',
    chapterInfoSelector: 'small',
  },
} as const;

export async function fetchNovloveHome() {
  return scrapingJobScheduler.addJob(() =>
    withNewPage(async (page) => {
      await page.goto(NOVLOVE_HOME.url, { waitUntil: 'domcontentloaded' });

      const hot = await page.$$eval(
        NOVLOVE_HOME.hot.selector,
        (elements, cfg) =>
          Array.from(elements).map((a) => {
            return {
              title: a.getAttribute(cfg.titleAttr) || '',
              url: a.href,
              cover:
                a
                  .querySelector(cfg.coverSelector)
                  ?.getAttribute(cfg.coverAttr) || '',
            };
          }),
        NOVLOVE_HOME.hot,
      );

      // Latest Releases
      const latest = await page.$$eval(
        NOVLOVE_HOME.latest.selector,
        (rows, cfg) =>
          Array.from(rows).map((row) => {
            const titleEl = row.querySelector(cfg.titleSelector);
            const chapterEl = row.querySelector(cfg.chapterSelector);

            return {
              title: titleEl?.textContent?.trim() || '',
              url: (titleEl as HTMLAnchorElement)?.href || '',
              genres: Array.from(row.querySelectorAll(cfg.genreSelector)).map(
                (g) => g.textContent?.trim() || '',
              ),
              latestChapter: {
                title: chapterEl?.textContent?.trim() || '',
                url: (chapterEl as HTMLAnchorElement)?.href || '',
              },
              updatedTime:
                row.querySelector(cfg.updatedSelector)?.textContent?.trim() ||
                '',
            };
          }),
        NOVLOVE_HOME.latest,
      );

      // 3. Completed Novels
      const completed = await page.$$eval(
        NOVLOVE_HOME.completed.selector,
        (elements, cfg) =>
          (elements as HTMLAnchorElement[]).map((a) => ({
            title: a.getAttribute(cfg.titleAttr) || '',
            url: a.href,
            cover:
              a.querySelector(cfg.coverSelector)?.getAttribute(cfg.coverAttr) ||
              '',
            chapterInfo:
              a.querySelector(cfg.chapterInfoSelector)?.textContent?.trim() ||
              '',
          })),
        NOVLOVE_HOME.completed,
      );

      return { hot, latest, completed };
    }),
  );
}
