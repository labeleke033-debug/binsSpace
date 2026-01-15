
import React from 'react';
import { Post } from '../types';

interface ManageProps {
  posts: Post[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onNew: () => void;
}

const Manage: React.FC<ManageProps> = ({ posts, onDelete, onEdit, onNew }) => {
  const handleDeleteClick = (id: number, title: string) => {
    // 明确的删除操作步骤：1. 确认 2. 调用回调进行 SQL 删除
    const confirmed = window.confirm(`警告：您正在执行删除操作。\n\n确定要从数据库中永久移除文章《${title}》吗？此操作无法撤销。`);
    if (confirmed) {
      console.log(`ManagePage: 用户确认删除 ID 为 ${id} 的文章`);
      onDelete(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">后台管理</h1>
          <p className="text-gray-400 mt-2">基于 SQLite (dev.db) 的实时管理面板</p>
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

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
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
                          title="编辑文章"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(post.id, post.title)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative z-10 active:scale-90"
                          title="删除文章"
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
                    数据库目前为空，开始创作吧。
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
