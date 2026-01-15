
import React, { useState, useEffect } from 'react';
import { Post, Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Editor from './pages/Editor';
import Manage from './pages/Manage';
import { isAuthorized } from './middleware';
import * as db from './lib/db';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);

  // 初始化数据库
  useEffect(() => {
    const setup = async () => {
      try {
        await db.initDB();
        const allPosts = db.getAllPosts();
        setPosts(allPosts);
        setIsDbReady(true);
        console.log("App: 数据库就绪，初始加载文章数:", allPosts.length);
      } catch (err) {
        console.error("App: 数据库初始化失败:", err);
      }
    };
    setup();
    setIsLoggedIn(isAuthorized());
  }, []);

  // 路由逻辑
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const protectedPaths = ['/post', '/manage'];
      const currentPath = '/' + hash.split('/')[1];

      if (protectedPaths.includes(currentPath) && !isAuthorized()) {
        window.location.hash = '/login';
        return;
      }

      if (hash.startsWith('/article/')) {
        const id = parseInt(hash.split('/')[2]);
        setSelectedPostId(id);
        setCurrentPage(Page.DETAIL);
      } else if (hash === '/login') {
        setCurrentPage(Page.LOGIN);
      } else if (hash === '/post') {
        setCurrentPage(Page.POST);
      } else if (hash === '/manage') {
        setCurrentPage(Page.MANAGE);
      } else {
        setCurrentPage(Page.HOME);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page, id?: number) => {
    if (id) {
      window.location.hash = `/article/${id}`;
    } else {
      window.location.hash = `/${page}`;
    }
  };

  const handleSavePost = (postData: Post) => {
    console.log("App: 正在请求保存文章...");
    db.savePost(postData);
    const updatedPosts = db.getAllPosts();
    setPosts(updatedPosts);
    console.log("App: 文章列表已同步，当前总数:", updatedPosts.length);
    navigate(Page.MANAGE);
  };

  const handleDeletePost = (id: number) => {
    const confirmed = window.confirm(`确定要从数据库中永久删除文章 (ID: ${id}) 吗？`);
    if (confirmed) {
      console.log(`App: 正在请求删除文章 ID: ${id}`);
      db.deletePost(id);
      
      // 关键：获取新数据并更新状态
      const remainingPosts = db.getAllPosts();
      setPosts(remainingPosts);
      
      console.log(`App: 删除完成。剩余文章数: ${remainingPosts.length}`);
      if (remainingPosts.length === 0) {
        console.warn("App: 数据库现在是空的。");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('is_auth');
    setIsLoggedIn(false);
    navigate(Page.HOME);
  };

  const renderPage = () => {
    if (!isDbReady) {
      return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse-slow">正在同步 SQLite 状态...</p>
        </div>
      );
    }

    switch (currentPage) {
      case Page.HOME:
        return <Home posts={posts} onPostClick={(id) => navigate(Page.DETAIL, id)} />;
      case Page.DETAIL:
        const post = posts.find(p => p.id === selectedPostId);
        return post ? <Detail post={post} /> : <div className="p-20 text-center text-gray-400">文章未找到。</div>;
      case Page.LOGIN:
        return <Login onLoginSuccess={() => { setIsLoggedIn(true); navigate(Page.MANAGE); }} />;
      case Page.POST:
        const editPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : undefined;
        return <Editor onSave={handleSavePost} initialPost={editPost} />;
      case Page.MANAGE:
        return (
          <Manage 
            posts={posts} 
            onDelete={handleDeletePost} 
            onEdit={(id) => { setSelectedPostId(id); navigate(Page.POST); }} 
            onNew={() => { setSelectedPostId(null); navigate(Page.POST); }} 
          />
        );
      default:
        return <Home posts={posts} onPostClick={(id) => navigate(Page.DETAIL, id)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onNavigateHome={() => navigate(Page.HOME)} 
        onNavigateLogin={() => navigate(Page.LOGIN)}
        onNavigateManage={() => navigate(Page.MANAGE)}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
