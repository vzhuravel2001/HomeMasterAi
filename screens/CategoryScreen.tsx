
import React from 'react';
import { Category, Task } from '../types';

interface CategoryScreenProps {
  category: Category;
  tasks: Task[];
  onBack: () => void;
  onSelectTask: (task: Task) => void;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, tasks, onBack, onSelectTask }) => {
  return (
    <div className="p-6">
      <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Назад к категориям
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-black/10`}>
          {category.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category.name}</h2>
          <p className="text-slate-500 dark:text-slate-500 text-sm">{tasks.length} доступных инструкций</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <button
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex justify-between items-center group hover:border-orange-500/30 dark:hover:border-orange-500/30 hover:bg-orange-50/30 dark:hover:bg-slate-750 transition-all text-left shadow-sm"
            >
              <div>
                <h3 className="text-slate-800 dark:text-white font-bold mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{task.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{task.difficulty}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {task.estimatedTime}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-white group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="text-4xl mb-4 opacity-30">🔍</div>
            <p className="text-slate-400 dark:text-slate-500">Задач пока нет. Попробуйте другую категорию или спросите в чате.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;
