
export interface Post {
  id: string;
  slug: string;       // 对应文件名，用于路由
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  isFeatured: boolean;
  category: string;
  tags?: string[];
}

// 移除 LOGIN 和 EDITOR，回归纯静态阅读器属性
export type PageType = 'HOME' | 'DETAIL';

export interface AppState {
  currentPage: PageType;
  selectedPostSlug: string | null;
}
