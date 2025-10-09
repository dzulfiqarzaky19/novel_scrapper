import { DetailConfig } from './detailScrapper.config.js';

export const parseDetail = (
  elements: Element[],
  config: DetailConfig['detail'],
) => {
  const {
    title,
    rating,
    alternateNames,
    author,
    genres,
    status,
    publishers,
    tags,
    year,
  } = config;

  return elements.map((root) => ({
    title: root.querySelector(title)?.textContent?.trim() || '',
    rating: {
      value: root.querySelector(rating.value)?.textContent?.trim() || '',
      count: root.querySelector(rating.count)?.textContent?.trim() || '',
    },
    alternateNames:
      root
        .querySelector(alternateNames)
        ?.textContent?.replace('Alternative names:', '')
        .trim() || '',
    author: {
      name: root.querySelector(author)?.textContent?.trim() || '',
      url: root.querySelector(author)?.getAttribute('href') || '',
    },
    genres: Array.from(root.querySelectorAll(genres)).map((g) => ({
      name: g.textContent?.trim() || '',
      url: g.getAttribute('href') || '',
    })),
    status: {
      text: root.querySelector(status)?.textContent?.trim() || '',
      url: root.querySelector(status)?.getAttribute('href') || '',
    },
    publishers:
      root
        .querySelector(publishers)
        ?.textContent?.replace('Publishers:', '')
        .trim() || '',
    tags: Array.from(root.querySelectorAll(tags)).map((t) => ({
      name: t.textContent?.trim() || '',
      url: t.getAttribute('href') || '',
    })),
    year: {
      text: root.querySelector(year)?.textContent?.trim() || '',
      url: root.querySelector(year)?.getAttribute('href') || '',
    },
  }));
};

export const parseLatestChapter = (
  elements: Element[],
  config: DetailConfig['latest_chapter'],
) => {
  const { title, url, released } = config;

  return Array.from(elements).map((a) => ({
    title: a.querySelector(title)?.textContent?.trim() || '',
    url: a.querySelector(url)?.getAttribute('href') || '',
    released: a.querySelector(released)?.textContent?.trim() || '',
  }));
};

export const parseDescription = (
  elements: Element[],
  config: DetailConfig['description'],
) => {
  const { selector } = config;

  return Array.from(elements).map(
    (a) => a.querySelector(selector)?.textContent?.trim() || '',
  );
};

export const parseChapters = (
  elements: Element[],
  config: DetailConfig['chapters'],
) => {
  const { selector } = config;

  return Array.from(elements).map((a) =>
    Array.from(a.querySelectorAll(selector))?.map((chapter) => ({
      title: chapter.textContent?.trim() || '',
      url: chapter.getAttribute('href') || '',
    })),
  );
};

export const parseAuthorNovels = (
  elements: Element[],
  config: DetailConfig['author_novels'],
) => {
  const { img, coverAttr, title, chapter, selector } = config;

  return Array.from(elements).map((a) =>
    Array.from(a.querySelectorAll(selector))?.map((novel) => {
      const cover =
        coverAttr
          .map((attr) => novel.querySelector(img)?.getAttribute(attr))
          .find(Boolean) || '';

      return {
        title: novel.querySelector(title)?.textContent?.trim() || '',
        url: novel.getAttribute('href') || '',
        cover,
        chapter: novel.querySelector(chapter)?.textContent?.trim() || '',
      };
    }),
  );
};

export const parseCover = (
  elements: Element[],
  config: DetailConfig['cover'],
) => {
  const { img, attr } = config;

  return Array.from(elements).map((root) => {
    const cover =
      attr
        .map((attr) => root.querySelector(img)?.getAttribute(attr))
        .find(Boolean) || '';

    return {
      url: cover,
    };
  });
};

export type ReturnTypeOfParseDetail = ReturnType<typeof parseDetail>;
export type ReturnTypeOfParseLatestChapter = ReturnType<
  typeof parseLatestChapter
>;
export type ReturnTypeOfParseDescription = ReturnType<typeof parseDescription>;
export type ReturnTypeOfParseChapters = ReturnType<typeof parseChapters>;
export type ReturnTypeOfParseAuthorNovels = ReturnType<
  typeof parseAuthorNovels
>;

export type ReturnTypeOfParseCover = ReturnType<typeof parseCover>;
