
import React, { useState } from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  avatarUrl: string;
  siteName: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateManage: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, avatarUrl, siteName, onNavigateHome, onNavigateLogin, onNavigateManage, onLogout }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-blue-100 cursor-pointer group transform active:scale-95 transition-all"
              onClick={() => setIsPreviewOpen(true)}
            >
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div 
              className="cursor-pointer group"
              onClick={onNavigateHome}
            >
              <span className="font-serif font-bold text-2xl text-gray-900 tracking-tight group-hover:text-blue-500 transition-colors">
                {siteName}
              </span>
            </div>
          </div>
          
          <nav className="flex items-center gap-8">
            <button onClick={onNavigateHome} className="text-gray-500 hover:text-blue-500 font-bold transition-colors text-sm uppercase tracking-widest">首页</button>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button onClick={onNavigateManage} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">后台管理</button>
                <button onClick={onLogout} className="text-red-400 hover:text-red-500 transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={onNavigateLogin} className="text-gray-500 hover:text-blue-500 font-bold transition-colors text-sm uppercase tracking-widest">登录</button>
            )}
          </nav>
        </div>
      </header>

      {/* Avatar Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-lg animate-in fade-in duration-300"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={avatarUrl} alt="Avatar Large" className="w-full h-full object-cover" />
            <button 
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
              onClick={() => setIsPreviewOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
