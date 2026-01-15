
import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateManage: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onNavigateHome, onNavigateLogin, onNavigateManage, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onNavigateHome}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-100 transform group-hover:rotate-12 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-serif font-bold text-2xl text-gray-900 tracking-tight transition-colors">zuobin.wang</span>
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
  );
};

export default Header;
