import { chapterSlugFromPath, toAbsolute, toPath } from '../url.js';

import { ReturnTypeOfParseChapter } from './chapterScrapper.parser.js';

const REGEX_NORMALIZER = {
  style: /window\.pubfuturetag[\s\S]*?};?/g,
  css: /\.[a-zA-Z0-9_-]+\s*{[^}]*}/g,
  spaces: /\s{2,}/g,
};

const normalizeChapterText = (raw: string): string => {
  return raw
    .replace(REGEX_NORMALIZER.style, '')
    .replace(REGEX_NORMALIZER.css, '')
    .replace(REGEX_NORMALIZER.spaces, ' ')
    .trim();
};

export const normalizeChapter = (raws: ReturnTypeOfParseChapter) => {
  const raw = raws[0];

  if (!raw) {
    return [];
  }

  return {
    title: raw.title,
    chapter_name: raw.chapter_name,
    prev_chapter: {
      absoluteUrl: toAbsolute(raw.prev_chapter),
      path: toPath(raw.prev_chapter),
      slug: chapterSlugFromPath(toPath(raw.prev_chapter)),
    },
    next_chapter: {
      absoluteUrl: toAbsolute(raw.next_chapter),
      path: toPath(raw.next_chapter),
      slug: chapterSlugFromPath(toPath(raw.next_chapter)),
    },
    content: normalizeChapterText(raw.content),
  };
};
