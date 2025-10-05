import type { EvaluateFuncWith, Page } from 'puppeteer';

export async function evalOrEmpty<Output, Config>(
  page: Page,
  selector: string,
  parser: (elements: Element[], config: Config) => Output,
  config: Config,
): Promise<Output> {
  const exists = await page.$(selector);

  if (!exists) {
    return parser([], config);
  }

  return page.$$eval(
    selector,
    // TypeScript quirk: needs to cast as its conflicting with puppeteer
    parser as EvaluateFuncWith<Element[], [Config]>,
    config,
  ) as Promise<Output>;
}
