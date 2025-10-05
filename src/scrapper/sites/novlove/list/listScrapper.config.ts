export const LIST_CONFIG = {
  sort: 'https://novlove.com/sort/nov-love-',
  genre: 'https://novlove.com/nov-love-genres/',

  selector: '#list-page .row',
  cover: {
    selector: 'img.cover',
    attributes: ['data-src', 'src'],
  },
  title: {
    selector: '.novel-title a',
    text: true,
    attr: 'title',
    href: true,
  },
  author: {
    selector: '.author',
    text: true,
  },
  latestChapter: {
    selector: '.chapter-title',
    text: true,
    href: true,
  },
} as const;

export type ListConfig = typeof LIST_CONFIG;
