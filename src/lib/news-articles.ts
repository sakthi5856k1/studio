export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  author: string;
  imageId: string;
};

export type NewsData = {
  newsletters: NewsArticle[];
};
