export type queries = {
  search: string | undefined;
  page: number;
  tags: string[] | undefined;
  year: number | undefined;
  price: number | undefined;
  platforms: string[] | undefined;
  metacritic: number | undefined;
  sort: string | undefined;
};

export type singleReqs = {
  CPU: string | undefined;
  GPU: string | undefined;
  RAM: number | undefined;
  VRAM: number | undefined;
  storage: number | undefined;
};

export type reqs = {
  min: singleReqs;
  rec: singleReqs;
};

export type DLC = {
  name: string;
  price: number | undefined;
};

export type gameState = {
  name: string;
  developer: string | undefined;
  publisher: string | undefined;
  series: string | undefined;
  release: number | undefined;
  price: number | undefined;
  metacritic: number | undefined;
  trailer: string | undefined;
  rank: string | undefined;
  tags: string[];
  platforms: string[];
  keywords: string[];
  descriptions: {
    en: string | undefined;
    ar: string | undefined;
    de: string | undefined;
    es: string | undefined;
    fr: string | undefined;
  };
  DLCs: DLC[];
  req: reqs;
};
