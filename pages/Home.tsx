import React, { useEffect, useMemo, useState } from "react";
import { Post } from "../types";
import { getAllPosts } from "../lib/posts";

interface HomeProps {
  onPostClick: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onPostClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getAllPosts();
        if (cancelled) return;

        setPosts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.message || "文章加载失败，请稍后重试。");
        setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredPost = useMemo(() => {
    if (!posts.length) return undefined;
    return posts.find((p) => p.isFeatured) || posts[0];
  }, [posts]);

  const morePosts = useMemo(() => {
    if (!featuredPost) return [];
    return posts.filter((p) => p.id !== featuredPost.id);
  }, [posts, featuredPost]);

  if (loading) {
    return (
        <div className="py-20 text-center text-gray-400">
          正在加载文章...
        </div>
    );
  }

  if (errorMsg) {
    return (
        <div className="py-20 text-center text-gray-400 space-y-4">
          <div>{errorMsg}</div>
          <div className="text-sm">
            请检查：<code className="px-1">/content/posts/manifest.json</code> 是否可访问，且里面列出的 md 文件存在。
          </div>
        </div>
    );
  }

  if (!featuredPost) {
    return <div className="py-20 text-center text-gray-400">目前没有任何文章。</div>;
  }

  return (
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Featured Post */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-50 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <span className="text-blue-500 font-semibold text-sm tracking-wide uppercase">置顶</span>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
              {featuredPost.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {featuredPost.author}
            </span>
              <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
                {featuredPost.date}
            </span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed line-clamp-3">
              {featuredPost.excerpt}
            </p>
            <button
                onClick={() => onPostClick(featuredPost.id)}
                className="inline-flex items-center gap-2 bg-blue-400 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-500 transition-all shadow-md shadow-blue-100 group"
            >
              阅读全文
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          {featuredPost.imageUrl && (
              <div className="md:w-1/2 w-full h-[400px] rounded-2xl overflow-hidden">
                <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
          )}
        </section>

        {/* More Stories */}
        <section className="space-y-8">
          <h2 className="text-4xl font-serif text-center text-gray-900">更多内容</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {morePosts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col group cursor-pointer hover:shadow-xl transition-all"
                    onClick={() => onPostClick(post.id)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                        src={post.imageUrl || "https://picsum.photos/seed/default/400/300"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{post.date}</div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center gap-1 text-blue-400 font-medium text-sm group-hover:gap-2 transition-all">
                      继续阅读
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
};

export default Home;
