
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

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: '写给新手的写作指南：从零开始的创作之旅',
    excerpt: '写作是一场极具回报的旅程。这篇指南将帮助你迈出第一步，涵盖叙事技巧、寻找个人风格以及建立持久习惯。',
    content: '## 欢迎进入写作的世界\n\n写作可以是一场非常有意义的旅程。这本指南将帮助你迈出第一步。我们将涵盖讲故事的基础知识、寻找你的声音，以及建立一致的写作习惯。\n\n### 寻找灵感\n\n灵感就在你身边：\n\n* 你的日常生活 and 经历。\n* 书籍、电影和音乐。\n* 与朋友和家人的对话。\n\n> "初稿只是你在给自己讲故事。" - Terry Pratchett\n\n从小处着手，每天写作，不要害怕犯错。祝写作愉快！',
    author: 'Admin',
    date: '2024年5月10日',
    imageUrl: 'https://picsum.photos/seed/writing/1200/600',
    isFeatured: true
  },
  {
    id: '2',
    title: '黄昏时分的城市探险',
    excerpt: '当夕阳西下，城市散发出一种奇妙的魔力。天空被染成橙紫色，街道上的灯火开始闪烁...',
    content: '城市之夜充满了活力和能量...',
    author: 'Admin',
    date: '2024年5月8日',
    imageUrl: 'https://picsum.photos/seed/city/800/500',
    isFeatured: false
  },
  {
    id: '3',
    title: '复古摄影的艺术',
    excerpt: '老式相机拥有一种现代数码相机往往缺乏的魅力。拍摄过程更慢、更深思熟虑...',
    content: '胶片摄影教会我们耐心和技术...',
    author: 'Admin',
    date: '2024年5月5日',
    imageUrl: 'https://picsum.photos/seed/camera/800/500',
    isFeatured: false
  },
  {
    id: '4',
    title: '穿行于秋日的森林',
    excerpt: '秋天是第二个春天，每一片叶子都是一朵花。在森林中漫步或驾车穿过，是一种极佳的享受...',
    content: '秋天的色彩令人叹为观止，充满了启发性...',
    author: 'Admin',
    date: '2024年5月2日',
    imageUrl: 'https://picsum.photos/seed/forest/800/500',
    isFeatured: false
  },
  {
    id: '5',
    title: '极简主义工作空间的秘密',
    excerpt: '一个整洁的桌面往往意味着一个清醒的大脑。探索如何通过减少杂物来提高效率...',
    content: '少即是多，极简主义不仅仅是一种审美...',
    author: 'Admin',
    date: '2024年4月30日',
    imageUrl: 'https://picsum.photos/seed/minimal/800/500',
    isFeatured: false
  },
  {
    id: '6',
    title: '午夜观星指南',
    excerpt: '远离城市灯光，仰望苍穹，你会发现一个完全不同的宇宙视角。带上你的望远镜...',
    content: '猎户座与大熊座在夜空中诉说着古老的神话...',
    author: 'Admin',
    date: '2024|4月28日',
    imageUrl: 'https://picsum.photos/seed/stars/800/500',
    isFeatured: false
  },
  {
    id: '7',
    title: '完美拿铁的拉花艺术',
    excerpt: '咖啡师是如何在奶泡上画出心形和叶子的？这需要精准的温度和纯熟的技巧...',
    content: '牛奶的质地决定了拉花的成败...',
    author: 'Admin',
    date: '2024年4月25日',
    imageUrl: 'https://picsum.photos/seed/coffee/800/500',
    isFeatured: false
  },
  {
    id: '8',
    title: '雨窗边的沉思',
    excerpt: '雨声是最好的背景音乐。在一个下雨的午后，静静地坐着看雨滴滑过窗户...',
    content: '孤独并不总是寂寞，有时它是灵魂的洗礼...',
    author: 'Admin',
    date: '2024年4月20日',
    imageUrl: 'https://picsum.photos/seed/rain/800/500',
    isFeatured: false
  },
  {
    id: '9',
    title: '山巅之上的壮阔景色',
    excerpt: '攀登虽然艰辛，但在山顶那一刻的豁然开朗足以弥补所有的疲惫。俯瞰群山...',
    content: '会当凌绝顶，一览众山小。这种成就感无可比拟...',
    author: 'Admin',
    date: '2024年4月15日',
    imageUrl: 'https://picsum.photos/seed/mountain/800/500',
    isFeatured: false
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('blog_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initial session check
  useEffect(() => {
    setIsLoggedIn(isAuthorized());
  }, []);

  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  // Routing with protection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // Protection logic (Simulating Middleware)
      const protectedPaths = ['/post', '/manage'];
      const currentPath = '/' + hash.split('/')[1];

      if (protectedPaths.includes(currentPath) && !isAuthorized()) {
        window.location.hash = '/login';
        return;
      }

      if (hash.startsWith('/article/')) {
        const id = hash.split('/')[2];
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

  const navigate = (page: Page, id?: string) => {
    if (id) {
      window.location.hash = `/article/${id}`;
    } else {
      window.location.hash = `/${page}`;
    }
  };

  const handleSavePost = (newPost: Post) => {
    setPosts(prev => {
      const index = prev.findIndex(p => p.id === newPost.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newPost;
        return updated;
      }
      return [newPost, ...prev];
    });
    navigate(Page.MANAGE);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('is_auth');
    setIsLoggedIn(false);
    navigate(Page.HOME);
  };

  const renderPage = () => {
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
        return <Manage posts={posts} onDelete={handleDeletePost} onEdit={(id) => { setSelectedPostId(id); navigate(Page.POST); }} onNew={() => { setSelectedPostId(null); navigate(Page.POST); }} />;
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
