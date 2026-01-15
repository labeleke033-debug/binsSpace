
import React, { useState, useEffect } from 'react';
import { Post, Page, Settings } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Editor from './pages/Editor';
import Manage from './pages/Manage';
import { isAuthorized } from './middleware';
import * as db from './lib/db';
import { CONFIG } from './config';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings>({ avatarUrl: '', siteName: 'zuobin.wang' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);

  // 初始化数据库
  useEffect(() => {
    const setup = async () => {
      try {
        await db.initDB();
        const [allPosts, currentSettings] = await Promise.all([
          db.getAllPosts(),
          db.getSettings()
        ]);
        setPosts(allPosts);
        setSettings(currentSettings);
        setIsDbReady(true);
      } catch (err) {
        console.error("App: 数据加载失败:", err);
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

  const handleSavePost = async (postData: Post) => {
    setIsDbReady(false);
    await db.savePost(postData);
    const updatedPosts = await db.getAllPosts();
    setPosts(updatedPosts);
    setIsDbReady(true);
    navigate(Page.MANAGE);
  };

  const handleDeletePost = async (id: number) => {
    setIsDbReady(false);
    try {
      await db.deletePost(id);
      const updatedPosts = await db.getAllPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error("App: 删除操作失败", error);
    } finally {
      setIsDbReady(true);
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    await db.updateSetting('avatarUrl', url);
    setSettings(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleUpdateSiteName = async (name: string) => {
    await db.updateSetting('siteName', name);
    setSettings(prev => ({ ...prev, siteName: name }));
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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-400 font-medium animate-pulse">正在同步数据...</p>
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
            settings={settings}
            onDelete={handleDeletePost} 
            onEdit={(id) => { setSelectedPostId(id); navigate(Page.POST); }} 
            onNew={() => { setSelectedPostId(null); navigate(Page.POST); }} 
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateSiteName={handleUpdateSiteName}
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
        avatarUrl={settings.avatarUrl}
        siteName={settings.siteName}
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
