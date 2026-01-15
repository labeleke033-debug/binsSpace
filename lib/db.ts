
import { Post, Settings } from '../types';
import { CONFIG } from '../config';

declare var initSqlJs: any;

let db: any = null;
const STORAGE_KEY = 'sqlite_blog_v2';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function uint8ArrayToBase64(u8: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < u8.length; i++) {
    bin += String.fromCharCode(u8[i]);
  }
  return btoa(bin);
}

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

  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });

  const savedDb = localStorage.getItem(STORAGE_KEY);
  if (savedDb) {
    db = new SQL.Database(base64ToUint8Array(savedDb));
    console.log("[Backend] 已加载持久化 dev.db");
    
    // 确保 settings 表存在 (迁移逻辑)
    db.run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);
  } else {
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
    db.run(`CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT)`);
    seedData();
  }
  await delay(200);
};

const persist = () => {
  const data = db.export();
  localStorage.setItem(STORAGE_KEY, uint8ArrayToBase64(data));
};

const seedData = () => {
  const initialPosts = [
    {
      title: '分布式架构：前后端端口分离指南',
      excerpt: '如何正确配置前端 3000 和后端 8088 的跨域通讯。',
      content: '## 端口分配方案\n\n前端运行在 3000，后端运行在 8088。',
      author: 'binbin',
      date: '2024年5月12日',
      imageUrl: 'https://picsum.photos/seed/ports/1200/600',
      isFeatured: 1
    }
  ];

  initialPosts.forEach(p => {
    db.run(
      "INSERT INTO posts (title, excerpt, content, author, date, imageUrl, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [p.title, p.excerpt, p.content, p.author, p.date, p.imageUrl, p.isFeatured]
    );
  });

  db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['avatarUrl', 'https://picsum.photos/seed/avatar/200/200']);
  db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['siteName', 'zuobin.wang']);
  
  persist();
};

export const getSettings = async (): Promise<Settings> => {
  const res = db.exec("SELECT key, value FROM settings");
  const settings: any = {};
  if (res.length > 0) {
    res[0].values.forEach((row: any[]) => {
      settings[row[0]] = row[1];
    });
  }
  return {
    avatarUrl: settings.avatarUrl || '',
    siteName: settings.siteName || 'Simple Blog'
  };
};

export const updateSetting = async (key: string, value: string): Promise<void> => {
  db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
  persist();
};

export const getAllPosts = async (): Promise<Post[]> => {
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

export const savePost = async (post: Partial<Post>): Promise<number> => {
  await delay(200);
  if (post.id && post.id !== 0) {
    db.run(
      "UPDATE posts SET title=?, excerpt=?, content=?, author=?, date=?, imageUrl=?, isFeatured=? WHERE id=?",
      [post.title, post.excerpt, post.content, post.author, post.date, post.imageUrl, post.isFeatured ? 1 : 0, post.id]
    );
    persist();
    return post.id;
  } else {
    db.run(
      "INSERT INTO posts (title, excerpt, content, author, date, imageUrl, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [post.title, post.excerpt, post.content, post.author, post.date, post.imageUrl, post.isFeatured ? 1 : 0]
    );
    const res = db.exec("SELECT last_insert_rowid()");
    persist();
    return res[0].values[0][0];
  }
};

export const deletePost = async (id: number): Promise<void> => {
  db.run("DELETE FROM posts WHERE id = ?", [id]);
  persist();
};
