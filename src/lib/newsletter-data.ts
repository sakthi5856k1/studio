import data from './newsletter-data.json';

export type Newsletter = {
  id: string;
  title: string;
  date: string;
  author: string;
  imageId: string;
};

export const Newsletters: Newsletter[] = data.newsletters;
