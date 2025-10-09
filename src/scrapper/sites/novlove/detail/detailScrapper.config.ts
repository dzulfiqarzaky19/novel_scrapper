export const DETAIL_CONFIG = {
  url: 'https://novlove.com/novel/',
  selector: '#novel',

  cover: {
    selector: '.book',
    img: 'img',
    attr: ['data-src', 'src'],
  },
  detail: {
    selector: '.desc',
    title: '.title',
    rating: {
      value: '.rate-info [itemprop="ratingValue"]',
      count: '.rate-info [itemprop="reviewCount"]',
    },
    alternateNames: '.info-meta li:nth-child(1)',
    author: '.info-meta li:nth-child(2) a',
    genres: '.info-meta li:nth-child(3) a',
    status: '.info-meta li:nth-child(4) a',
    publishers: '.info-meta li:nth-child(5)',
    tags: '.tag-container a',
    year: '.info-meta li:nth-child(7) a',
    li: '.info-meta li',
  },

  latest_chapter: {
    title: '.item-value a',
    url: '.item-value a',
    released: '.item-time',
  },

  description: {
    selector: '#tab-description',
  },

  chapters: {
    selector: '#tab-chapters .list-chapter li a',
  },

  author_novels: {
    selector: '#tab-author .row a',
    img: 'img',
    coverAttr: ['data-src', 'src'],
    title: 'h3',
    chapter: 'small',
  },
} as const;

export type DetailConfig = typeof DETAIL_CONFIG;
