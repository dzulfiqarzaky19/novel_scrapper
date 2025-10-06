export const NOVLOVE_CONFIG = {
  home: {
    redis_key: 'novlove:home:v1',
    ttl_seconds: 60 * 60,
  },
  sort: {
    redis_key: 'novlove:sort:v1',
    ttl_seconds: 2 * 60 * 60,
  },
  genre: {
    redis_key: 'novlove:genre:v1',
    ttl_seconds: 6 * 60 * 60,
  },
} as const;

export type NovloveConfig = typeof NOVLOVE_CONFIG;
