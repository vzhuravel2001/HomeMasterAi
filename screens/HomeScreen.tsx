
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface HomeScreenProps {
  onSelectCategory: (category: Category) => void;
  onOpenColorPicker: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCategory, onOpenColorPicker }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Что будем делать?</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Выберите категорию работ или воспользуйтесь поиском по фото</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-slate-700/50 transition-all text-left shadow-md dark:shadow-lg group"
          >
            <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-inner shadow-black/10 group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <span className="text-slate-800 dark:text-white font-semibold text-sm leading-tight">{cat.name}</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 uppercase font-bold tracking-tighter">12+ задач</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {/* AR Widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/20 dark:to-orange-600/5 border border-orange-500/20">
          <h3 className="text-orange-600 dark:text-orange-400 font-bold mb-1">Примерка интерьера</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
            Посмотрите, как будут смотреться новые обои или ламинат.
          </p>
          <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
            Попробовать AR
          </button>
        </div>

        {/* Color Picker Widget - NEW */}
        <button 
          onClick={onOpenColorPicker}
          className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:border-blue-500/50 transition-all text-left shadow-md group"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            🎨
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm">Определитель цвета</h3>
            <p className="text-slate-500 text-[10px]">Наведите камеру, чтобы узнать HEX-код</p>
          </div>
          <span className="text-blue-500">→</span>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
