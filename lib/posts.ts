
import matter from 'gray-matter';
import { Post } from '../types';
import { Buffer } from 'buffer';

// 为浏览器提供 Buffer polyfill，解析 Frontmatter 必需
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

/**
 * 核心逻辑：尝试使用 Vite 的 glob 导入。
 * 如果环境不支持（如纯原生 ESM 环境），则回退到硬编码的静态内容映射。
 */
let postFiles: Record<string, any> = {};

try {
  // 仅在支持 glob 的环境（如 Vite）下尝试调用
  if (typeof (import.meta as any).glob === 'function') {
    postFiles = (import.meta as any).glob('/content/posts/*.md', { query: '?raw', eager: true });
  } else {
    throw new Error('glob not supported');
  }
} catch (e) {
  // 回退方案：手动映射当前项目中的 Markdown 文件内容
  // 这样做是为了在不支持 glob 的环境下依然能保持 "Git + Markdown" 的逻辑一致性
  postFiles = {
    '/content/posts/modern-minimalism.md': `---
title: "现代主义：设计中的呼吸感与留白"
date: "2025-02-15"
author: "Binbin"
category: "Design"
isFeatured: true
imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80"
slug: "modern-minimalism"
---
## 什么是呼吸感？

设计中的“白”并不是空白，而是为了让主体更好地呼吸。当你移除掉多余的装饰，剩下的才是本质。

> "Less is only more when it is better." — Dieter Rams

### 核心要点
* 负空间的运用
* 字体层次的建立
* 色彩克制的艺术`,
    '/content/posts/rust-future.md': `---
title: "Rust 与系统级开发的未来"
date: "2025-02-10"
author: "Admin"
category: "Tech"
isFeatured: false
imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
slug: "rust-future"
---
Rust 解决了很多 C++ 中困扰开发者多年的痛点。

### 为什么选择 Rust？
1. **内存安全**：所有权系统杜绝了段错误。
2. **极高性能**：接近 C++ 的零成本抽象。
3. **现代工具链**：Cargo 是目前最好用的包管理器之一。`
  };
}

export const getAllPosts = (): Post[] => {
  const posts = Object.entries(postFiles).map(([path, content]: [string, any], index: number) => {
    // 处理不同环境下的内容加载方式
    const rawContent = typeof content === 'string' ? content : (content.default || content);
    if (!rawContent) return null;

    try {
      const { data, content: body } = matter(rawContent);
      const fileName = path.split('/').pop()?.replace('.md', '') || '';

      return {
        id: (index + 1).toString(),
        slug: data.slug || fileName,
        title: data.title || 'Untitled',
        excerpt: data.description || data.excerpt || body.substring(0, 150).replace(/[#*`>]/g, '') + '...',
        content: body,
        author: data.author || 'Binbin',
        date: data.date ? new Date(data.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : '未知日期',
        imageUrl: data.imageUrl || `https://picsum.photos/seed/${fileName}/1200/600`,
        isFeatured: !!data.isFeatured,
        category: data.category || 'General'
      } as Post;
    } catch (err) {
      console.error(`Error parsing ${path}:`, err);
      return null;
    }
  }).filter((p): p is Post => p !== null);

  // 按日期倒序排列
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return getAllPosts().find(p => p.slug === slug);
};
