
import React from 'react';
import { Post } from '../types';

interface DetailProps {
  post: Post;
}

const Detail: React.FC<DetailProps> = ({ post }) => {
  return (
    <article className="max-w-4xl mx-auto py-12">
      <header className="text-center space-y-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-gray-400 text-sm font-medium">
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {post.date}
          </span>
        </div>
        
        {post.imageUrl && (
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
            <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[600px] object-cover" />
          </div>
        )}
      </header>

      <section className="prose prose-lg md:prose-xl prose-blue max-w-none px-4 text-gray-700 space-y-6 leading-relaxed">
        {post.content.split('\n').map((line, idx) => {
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-3xl font-serif font-bold text-gray-900 mt-12 mb-6 border-b pb-2">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-blue-400 pl-6 py-2 italic text-gray-500 text-xl font-serif my-8">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('* ')) {
            return <li key={idx} className="ml-6 list-disc">{line.replace('* ', '')}</li>;
          }
          if (line.trim() === '') return <div key={idx} className="h-4"></div>;
          return <p key={idx} className="mb-4">{line}</p>;
        })}
      </section>
    </article>
  );
};

export default Detail;
