import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Post, PageType } from './types';
import { getAllPosts, getPostBySlug } from './lib/posts';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- 主应用组件 ---
const App: React.FC = () => {
    // ✅ posts 改为 state（保证永远是数组，而不是 Promise）
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const [currentPage, setCurrentPage] = useState<PageType>(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/article/')) return 'DETAIL';
        return 'HOME';
    });

    const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(() => {
        const hash = window.location.hash;
        return hash.startsWith('#/article/') ? hash.replace('#/article/', '') : null;
    });

    // ✅ 首次加载文章（从 /content/posts/manifest.json + md fetch）
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setErrorMsg('');
                const data = await getAllPosts(); // async
                if (cancelled) return;
                setPosts(Array.isArray(data) ? data : []);
            } catch (e: any) {
                if (cancelled) return;
                setErrorMsg(e?.message || '文章加载失败，请稍后重试。');
                setPosts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // 处理浏览器前进后退
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/article/')) {
                setSelectedPostSlug(hash.replace('#/article/', ''));
                setCurrentPage('DETAIL');
            } else {
                setCurrentPage('HOME');
                setSelectedPostSlug(null);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // --- 导航函数 ---
    const goHome = () => (window.location.hash = '/');
    const goDetail = (slug: string) => (window.location.hash = `/article/${slug}`);

    // ✅ 详情页文章：从已加载的 posts 里找（更快、更一致）
    const selectedPost = useMemo(() => {
        if (!selectedPostSlug) return null;
        return posts.find((p) => p.slug === selectedPostSlug) || null;
    }, [posts, selectedPostSlug]);

    return (
        <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
            {/* 极简导航：移除了管理与登录入口 */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={goHome}>
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                group-hover:from-blue-500 group-hover:via-green-400 group-hover:to-yellow-300
                rounded-lg transition-all duration-500 group-hover:rotate-12"
                        />
                        <span className="font-serif text-2xl font-bold tracking-tighter">Binbin's Space.</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <button onClick={goHome} className="text-sm font-semibold hover:text-blue-600 transition-colors">
                            文章
                        </button>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition-all"
                        >
                            GIT SOURCE
                        </a>
                    </div>
                </div>
            </nav>

            {/* 路由分发 */}
            <main className="flex-grow">
                {loading && (
                    <div className="py-20 text-center text-gray-400">
                        正在加载文章...
                    </div>
                )}

                {!loading && errorMsg && (
                    <div className="py-20 text-center text-gray-400 space-y-3">
                        <div>{errorMsg}</div>
                        <div className="text-sm">
                            请检查：<code className="px-1">/content/posts/manifest.json</code> 是否可访问，且列出的 md 文件存在。
                        </div>
                    </div>
                )}

                {!loading && !errorMsg && currentPage === 'HOME' && (
                    <HomePage posts={posts} onPostClick={goDetail} />
                )}

                {!loading && !errorMsg && currentPage === 'DETAIL' && selectedPostSlug && (
                    selectedPost ? (
                        <DetailPage post={selectedPost} onBack={goHome} />
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            未找到该文章：{selectedPostSlug}
                            <div className="mt-4">
                                <button onClick={goHome} className="text-blue-600 hover:underline">返回首页</button>
                            </div>
                        </div>
                    )
                )}
            </main>

            <footer className="py-16 border-t border-gray-100 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-left">
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                            春庭月午，摇荡香醪光欲舞。<br />
                            路转回廊，半落梅花婉娩香。
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex gap-4 text-xs font-bold text-gray-400">
                            <span></span>
                        </div>
                        <p className="text-gray-300 text-[10px] uppercase tracking-widest"></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- 子页面组件 ---
const HomePage: React.FC<{ posts: Post[]; onPostClick: (slug: string) => void }> = ({ posts, onPostClick }) => {
    const featured = posts.find((p) => p.isFeatured) || posts[0];
    const others = posts.filter((p) => p.slug !== featured?.slug);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {featured && (
                <section
                    className="mb-24 grid lg:grid-cols-2 gap-12 items-center cursor-pointer group"
                    onClick={() => onPostClick(featured.slug)}
                >
                    <div className="aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl">
                        <img
                            src={featured.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{featured.category}</span>
                        <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-[1.1]">{featured.title}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed line-clamp-3">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                            <span className="text-sm font-bold text-gray-900">{featured.author}</span>
                            <span className="text-gray-200">|</span>
                            <span className="text-sm text-gray-400">{featured.date}</span>
                        </div>
                    </div>
                </section>
            )}

            <div className="mb-10 flex items-center justify-between border-b pb-4 border-gray-100">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Latest Stories</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {others.map((post) => (
                    <article
                        key={post.slug}
                        className="group cursor-pointer space-y-5"
                        onClick={() => onPostClick(post.slug)}
                    >
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img
                                src={post.imageUrl}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{post.category}</span>
                            <h3 className="text-2xl font-serif font-bold group-hover:text-blue-600 transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                            <div className="pt-2 text-[10px] font-bold text-gray-300 flex items-center gap-2">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>BY {post.author.toUpperCase()}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

const DetailPage: React.FC<{ post: Post; onBack: () => void }> = ({ post, onBack }) => {
    if (!post) return null;
    return (
        <article className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in duration-500">
            <button
                onClick={onBack}
                className="mb-16 flex items-center gap-2 text-gray-300 hover:text-black transition-colors font-bold text-xs tracking-widest group"
            >
                <svg
                    className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                BACK TO FEED
            </button>

            <header className="space-y-8 mb-16 text-center">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-600 block">{post.category}</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">{post.title}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400 font-medium">
                    <span>Written by {post.author}</span>
                    <span className="text-gray-200">/</span>
                    <span>{post.date}</span>
                </div>
            </header>

            <div className="w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-20">
                <img src={post.imageUrl} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg md:prose-xl mx-auto max-w-none prose-slate">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </div>

        </article>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App/>);
