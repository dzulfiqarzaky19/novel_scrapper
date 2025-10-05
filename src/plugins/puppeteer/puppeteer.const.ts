export const PUPPETEER_CONFIG = {
  name: 'puppeteer',
  waitOption: 'domcontentloaded',
  timeout: { navigation: 30_000, selector: 10_000 },
  viewport: { width: 1280, height: 1024 },
  assets: {
    isBlocked: true,
    types: ['image', 'stylesheet', 'font', 'media'] as string[],
  },
} as const;
