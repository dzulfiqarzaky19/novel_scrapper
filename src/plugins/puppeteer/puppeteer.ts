import fp from 'fastify-plugin';
import type { Page, Browser } from 'puppeteer';

import {
  getSharedBrowserInstance,
  closeSharedBrowserInstance,
} from './puppeteer.utils.js';
import { PUPPETEER_CONFIG } from './puppeteer.const.js';

export default fp(async (fastify) => {
  const browser: Browser = await getSharedBrowserInstance();

  fastify.decorate(PUPPETEER_CONFIG.name, {
    browser,

    async getPage(url: string, selectors?: string[]): Promise<Page> {
      new URL(url);

      const page = await browser.newPage();

      page.setDefaultNavigationTimeout(PUPPETEER_CONFIG.timeout.navigation);
      page.setDefaultTimeout(PUPPETEER_CONFIG.timeout.selector);

      if (PUPPETEER_CONFIG.assets.isBlocked) {
        await page.setRequestInterception(true);

        const block = (req: any) => {
          if (PUPPETEER_CONFIG.assets.types.includes(req.resourceType())) {
            req.abort();

            return;
          }

          req.continue();
        };

        page.on('request', block);
      }

      await page.setViewport(PUPPETEER_CONFIG.viewport);
      await page.goto(url, { waitUntil: PUPPETEER_CONFIG.waitOption });

      if (selectors && selectors?.length > 0) {
        await Promise.all(
          selectors.map((selector) =>
            page.waitForSelector(selector, {
              timeout: PUPPETEER_CONFIG.timeout.selector,
            }),
          ),
        );
      }

      return page;
    },
  });

  fastify.addHook('onClose', async () => {
    await closeSharedBrowserInstance();
  });
});
