
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  isFeatured: boolean;
}

export enum Page {
  HOME = 'home',
  DETAIL = 'detail',
  LOGIN = 'login',
  POST = 'post',
  MANAGE = 'manage'
}
