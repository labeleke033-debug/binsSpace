
import React from 'react';
import { Post } from '../types';

interface ManageProps {
  posts: Post[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onNew: () => void;
}

const Manage: React.FC<ManageProps> = ({ posts, onDelete, onEdit, onNew }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={onNew}
          className="bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-md shadow-blue-50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Post
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
              <th className="px-8 py-5">Post Title</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map(post => (
              <tr key={post.id} className="group hover:bg-blue-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={post.imageUrl || 'https://picsum.photos/50/50'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-gray-900 line-clamp-1">{post.title}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm">{post.date}</td>
                <td className="px-8 py-6">
                  {post.isFeatured ? (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Standard</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                  <button 
                    onClick={() => onEdit(post.id)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(post.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage;
