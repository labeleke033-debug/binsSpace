
import { Post } from '../types';

declare var initSqlJs: any;

let db: any = null;
const STORAGE_KEY = 'sqlite_blog_v2';

// 编码转换：Uint8Array 转 Base64
function uint8ArrayToBase64(u8: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < u8.length; i++) {
    bin += String.fromCharCode(u8[i]);
  }
  return btoa(bin);
}

// 解码转换：Base64 转 Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const bin = atob(base64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    u8[i] = bin.charCodeAt(i);
  }
  return u8;
}

export const initDB = async (): Promise<void> => {
  if (db) return;

  console.log("Prisma-Sim: 正在连接 SQLite 引擎 (SQL.js)...");
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });

  const savedDb = localStorage.getItem(STORAGE_KEY);
  if (savedDb) {
    console.log("Prisma-Sim: 读取本地 dev.db 文件镜像...");
    db = new SQL.Database(base64ToUint8Array(savedDb));
  } else {
    console.log("Prisma-Sim: dev.db 不存在，正在执行 npx prisma db push...");
    db = new SQL.Database();
    db.run(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        author TEXT,
        date TEXT,
        imageUrl TEXT,
        isFeatured INTEGER DEFAULT 0
      )
    `);
    seedData();
  }
};

const persist = () => {
  const data = db.export();
  localStorage.setItem(STORAGE_KEY, uint8ArrayToBase64(data));
  console.log("Prisma-Sim: 数据库已持久化至浏览器存储 (模拟文件写入成功)");
};

const seedData = () => {
  console.log("Prisma-Sim: 正在执行数据初始化 (Seed)...");
  const initialPosts = [
    {
      title: '欢迎来到我的个人博客',
      excerpt: '这是一个基于 SQLite 的高保定个人出版平台。',
      content: '## 开始你的创作\n\n你可以登录后台管理系统，发布、编辑或删除文章。所有的变更都会实时同步到 SQLite 数据库中。',
      author: 'Admin',
      date: '2024年5月10日',
      imageUrl: 'https://picsum.photos/seed/writing/1200/600',
      isFeatured: 1
    }
  ];

  initialPosts.forEach(p => {
    db.run(
      "INSERT INTO posts (title, excerpt, content, author, date, imageUrl, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [p.title, p.excerpt, p.content, p.author, p.date, p.imageUrl, p.isFeatured]
    );
  });
  persist();
};

export const getAllPosts = (): Post[] => {
  const res = db.exec("SELECT * FROM posts ORDER BY id DESC");
  if (res.length === 0) return [];
  
  const columns = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const post: any = {};
    columns.forEach((col: string, i: number) => {
      post[col] = row[i];
    });
    post.isFeatured = post.isFeatured === 1;
    return post as Post;
  });
};

export const savePost = (post: Partial<Post>): number => {
  if (post.id && post.id !== 0) {
    console.log(`Prisma-Sim: prisma.post.update({ where: { id: ${post.id} } })`);
    db.run(
      "UPDATE posts SET title=?, excerpt=?, content=?, author=?, date=?, imageUrl=?, isFeatured=? WHERE id=?",
      [post.title, post.excerpt, post.content, post.author, post.date, post.imageUrl, post.isFeatured ? 1 : 0, post.id]
    );
    persist();
    return post.id;
  } else {
    console.log(`Prisma-Sim: prisma.post.create({ data: ... })`);
    db.run(
      "INSERT INTO posts (title, excerpt, content, author, date, imageUrl, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [post.title, post.excerpt, post.content, post.author, post.date, post.imageUrl, post.isFeatured ? 1 : 0]
    );
    const res = db.exec("SELECT last_insert_rowid()");
    persist();
    return res[0].values[0][0];
  }
};

export const deletePost = (id: number): void => {
  console.log(`Prisma-Sim: prisma.post.delete({ where: { id: ${id} } })`);
  db.run("DELETE FROM posts WHERE id = ?", [id]);
  
  // 确认记录已被移除
  const check = db.exec("SELECT COUNT(*) FROM posts WHERE id = ?", [id]);
  if (check[0].values[0][0] === 0) {
    console.log(`Prisma-Sim: ID 为 ${id} 的文章已从 SQLite 中成功删除。`);
    persist();
  }
};
