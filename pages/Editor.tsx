
import React, { useState, useRef } from 'react';
import { Post } from '../types';

interface EditorProps {
  initialPost?: Post;
  onSave: (post: Post) => void;
}

const Editor: React.FC<EditorProps> = ({ initialPost, onSave }) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [isFeatured, setIsFeatured] = useState(initialPost?.isFeatured || false);
  const [imageUrl, setImageUrl] = useState(initialPost?.imageUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }
    const post: Post = {
      // 0 表示新文章，SQLite 将自动生成 ID
      id: initialPost?.id || 0,
      title,
      content,
      isFeatured,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/1200/600`,
      excerpt: content.substring(0, 150).replace(/[#*`>]/g, '') + '...',
      author: 'Admin',
      date: initialPost?.date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    onSave(post);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          {initialPost ? '编辑文章' : '写新文章'}
        </h1>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-400 focus:ring-blue-100"
            />
            <span className="text-sm text-gray-500 group-hover:text-gray-700">设为精选文章</span>
          </label>
          <button 
            onClick={handleSave}
            className="bg-blue-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
            </svg>
            {initialPost ? '更新文章' : '发布到 SQLite'}
          </button>
        </div>
      </div>

      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-serif p-6 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
        placeholder="文章标题..."
      />

      <div className="grid md:grid-cols-2 gap-8 h-[600px]">
        {/* Editor Area */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none font-mono text-gray-600 outline-none leading-relaxed"
              placeholder="使用 Markdown 编写内容...&#10;&#10;## 标题&#10;> 引用内容&#10;* 列表项目"
            />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <div 
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 bg-white transition-all cursor-pointer group overflow-hidden ${
              isDragging ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    更换图片
                  </span>
                </div>
                <button 
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 text-center px-4">
                  <span className="text-blue-400 font-medium">点击上传</span> 或将图片拖拽至此
                  <br />
                  <span className="text-xs">支持 JPG, PNG, WEBP</span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase">实时预览 (SQLite Schema)</h2>
            {isFeatured && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">精选</span>}
          </div>
          <div className="prose prose-blue max-w-none space-y-4">
            {imageUrl && (
              <img src={imageUrl} alt="Banner Preview" className="w-full h-40 object-cover rounded-xl mb-6 shadow-sm" />
            )}
            <h1 className="text-3xl font-serif font-bold text-gray-900">{title || '文章标题'}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-50">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Admin</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
            {content.split('\n').map((line, idx) => {
              if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-serif font-bold mt-6 text-gray-900">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-serif font-bold mt-4 text-gray-800">{line.replace('### ', '')}</h3>;
              if (line.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-blue-400 pl-4 py-1 italic text-gray-500 font-serif my-4 bg-gray-50 rounded-r">{line.replace('> ', '')}</blockquote>;
              if (line.startsWith('* ')) return <li key={idx} className="ml-4 text-gray-600">{line.replace('* ', '')}</li>;
              if (line.trim() === '') return <div key={idx} className="h-2" />;
              return <p key={idx} className="text-gray-600 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
