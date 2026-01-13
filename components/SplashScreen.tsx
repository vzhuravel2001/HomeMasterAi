
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
      
      {/* Logo Animation */}
      <div className="relative mb-8 animate-in fade-in zoom-in duration-1000 ease-out">
        <div className="w-24 h-24 bg-orange-500 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-[0_0_50px_rgba(249,115,22,0.3)] relative z-10">
          H
          <div className="absolute inset-0 bg-orange-500 rounded-[2rem] animate-ping opacity-20"></div>
        </div>
      </div>

      {/* Text Animation */}
      <div className="text-center relative z-10 overflow-hidden">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 animate-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          HomeMaster<span className="text-orange-500">AI</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-700 fill-mode-both">
          Smart Home Assistant
        </p>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-12 right-12">
        <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 animate-[loading_2.5s_ease-in-out_forwards]"></div>
        </div>
        <div className="mt-4 flex justify-center">
          <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest animate-pulse">Инициализация систем...</span>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          20% { width: 30%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
