
import React, { useState, useRef, useEffect } from 'react';
import { Post, Settings } from '../types';
import ConfirmModal from '../components/ConfirmModal';

interface ManageProps {
  posts: Post[];
  settings: Settings;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onNew: () => void;
  onUpdateAvatar: (url: string) => void;
  onUpdateSiteName: (name: string) => void;
}

const Manage: React.FC<ManageProps> = ({ posts, settings, onDelete, onEdit, onNew, onUpdateAvatar, onUpdateSiteName }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; postId: number | null; postTitle: string }>({
    isOpen: false,
    postId: null,
    postTitle: ''
  });
  const [siteNameInput, setSiteNameInput] = useState(settings.siteName);
  const [isSavingName, setIsSavingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSiteNameInput(settings.siteName);
  }, [settings.siteName]);

  const handleDeleteClick = (id: number, title: string) => {
    setModalState({
      isOpen: true,
      postId: id,
      postTitle: title
    });
  };

  const handleConfirmDelete = () => {
    if (modalState.postId !== null) {
      onDelete(modalState.postId);
    }
    setModalState({ isOpen: false, postId: null, postTitle: '' });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdateAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSiteName = async () => {
    if (siteNameInput.trim() === '') return;
    setIsSavingName(true);
    await onUpdateSiteName(siteNameInput.trim());
    setIsSavingName(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <ConfirmModal 
        isOpen={modalState.isOpen}
        title="确认删除文章？"
        message={`您确定要从数据库中永久移除文章《${modalState.postTitle}》吗？删除后，该文章将不再显示在首页且无法找回。`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalState({ isOpen: false, postId: null, postTitle: '' })}
      />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">后台管理</h1>
          <p className="text-gray-400 mt-2">管理您的内容与个人偏好设置</p>
        </div>
        <button 
          type="button"
          onClick={onNew}
          className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          撰写新文章
        </button>
      </div>

      {/* Profile Settings Section */}
      <section className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden p-8">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img src={settings.avatarUrl} alt="Current Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">更换头像</span>
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors active:scale-90"
              title="修改头像"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="flex-grow space-y-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900">个人资料设置</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="site-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">站点名称</label>
                <div className="flex gap-3">
                  <input 
                    id="site-name"
                    type="text"
                    value={siteNameInput}
                    onChange={(e) => setSiteNameInput(e.target.value)}
                    className="flex-grow px-5 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                    placeholder="输入您的站点名称"
                  />
                  <button 
                    onClick={handleSaveSiteName}
                    disabled={isSavingName || siteNameInput === settings.siteName}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                  >
                    {isSavingName ? '保存中...' : '更新名称'}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              提示：头像和站点名称的更改将立即同步到全站。
            </p>
          </div>
        </div>
      </section>

      {/* Post List Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
        <div className="px-10 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">文章列表</h2>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">共 {posts.length} 篇内容</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/20 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                <th className="px-10 py-6">文章标题 (ID)</th>
                <th className="px-10 py-6">发布日期</th>
                <th className="px-10 py-6">展示状态</th>
                <th className="px-10 py-6 text-right">操作选项</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length > 0 ? (
                posts.map(post => (
                  <tr key={post.id} className="group hover:bg-blue-50/20 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                          <img 
                            src={post.imageUrl || `https://picsum.photos/seed/${post.id}/100/100`} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </span>
                          <span className="text-xs text-gray-400 block">ID: {post.id} • {post.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-gray-500 font-medium">{post.date}</td>
                    <td className="px-10 py-8">
                      {post.isFeatured ? (
                        <span className="bg-blue-50 text-blue-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">精选文章</span>
                      ) : (
                        <span className="bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-100">普通文章</span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => onEdit(post.id)}
                          className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all relative z-10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(post.id, post.title)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative z-10 active:scale-90"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-gray-400 italic">
                    数据库目前为空。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manage;
