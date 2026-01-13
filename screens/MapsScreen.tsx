
import React, { useState } from 'react';

const MapsScreen: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="p-6 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ближайшие магазины</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Что ищем? (цемент, розетки, кран...)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-10 py-3 text-sm text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-200 dark:bg-slate-950 relative overflow-hidden">
        {/* Mock Map Placeholder */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/800/1200?grayscale')] opacity-20 dark:opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
          </div>
          <div className="absolute top-1/4 left-1/3 w-8 h-10 bg-orange-500 rounded-t-full rounded-br-full -rotate-45 flex items-center justify-center shadow-lg">
             <div className="w-3 h-3 bg-white rounded-full rotate-45"></div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-10 bg-orange-500 rounded-t-full rounded-br-full -rotate-45 flex items-center justify-center shadow-lg">
             <div className="w-3 h-3 bg-white rounded-full rotate-45"></div>
          </div>
        </div>

        {/* Floating List Item */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-100/10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700">
               <img src="https://picsum.photos/seed/shop/100/100" alt="Shop" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm">Петрович (Строительный центр)</h4>
              <p className="text-slate-500 dark:text-slate-500 text-[10px]">г. Москва, ул. Энтузиастов, 12 • 450м</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500">★★★★☆</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">(452 отзыва)</span>
              </div>
            </div>
            <button className="bg-orange-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsScreen;
