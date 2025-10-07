export type ListRequest = {
  Querystring: {
    page?: string;
  };
};

export type SortRequest = ListRequest & {
  Params: {
    sort: string;
  };
};

export type GenreRequest = ListRequest & {
  Params: {
    genre: string;
  };
};

export type NovelRequest = {
  Params: {
    novel: string;
  };
};

export type ChapterRequest = NovelRequest & {
  Params: {
    chapter: string;
  };
};
