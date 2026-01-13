
import React from 'react';

const ProjectsScreen: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">На стройке</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Портфолио и крупные проекты под ключ</p>

      <div className="space-y-6">
        {[
          { title: 'Ремонт "Скандинавия"', desc: 'Полная перепланировка и отделка квартиры 64м²', img: 'https://picsum.photos/seed/renov1/400/250' },
          { title: 'Кухня-лофт', desc: 'Сборка мебели, подключение техники и освещения', img: 'https://picsum.photos/seed/renov2/400/250' }
        ].map((p, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl group transition-all hover:border-orange-500/30">
            <div className="h-48 relative">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">Завершен</div>
            </div>
            <div className="p-5">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{p.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">{p.desc}</p>
              <button className="w-full border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 rounded-lg transition-all active:scale-95 shadow-sm">Посмотреть кейс</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsScreen;
