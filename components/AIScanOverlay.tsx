
import React, { useState, useRef, useEffect } from 'react';
import { analyzeProblem } from '../services/geminiService';

interface AIScanOverlayProps {
  onClose: () => void;
  onFoundProblem: (categoryName: string) => void;
}

const AIScanOverlay: React.FC<AIScanOverlayProps> = ({ onClose, onFoundProblem }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    const analysis = await analyzeProblem(base64Image);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay Scanner UI */}
        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 -mt-1 -ml-1 rounded-tl-lg"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 -mt-1 -mr-1 rounded-tr-lg"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 -mb-1 -ml-1 rounded-bl-lg"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 -mb-1 -mr-1 rounded-br-lg"></div>
             
             {isAnalyzing && (
               <div className="absolute inset-0 bg-orange-500/20 animate-pulse flex items-center justify-center">
                 <span className="text-orange-500 font-bold tracking-widest text-[10px] uppercase">Анализ...</span>
               </div>
             )}
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
           <button onClick={onClose} className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-orange-500 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
           <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
             AI Диагностика
           </div>
        </div>
      </div>

      {/* Bottom Result / Controls */}
      <div className="bg-slate-900 p-8 pt-12 rounded-t-[40px] -mt-10 relative z-10 border-t border-slate-700">
        {!result ? (
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Наведите на проблему</h3>
            <p className="text-slate-500 text-sm mb-8">ИИ проанализирует повреждение и подберет инструкцию</p>
            <button 
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className={`w-20 h-20 rounded-full border-8 border-slate-800 ${isAnalyzing ? 'bg-slate-700 cursor-not-allowed' : 'bg-orange-500 active:scale-95'} transition-all mx-auto flex items-center justify-center shadow-xl shadow-orange-500/20`}
            >
              <div className="w-12 h-12 rounded-full border-2 border-white/30"></div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl border border-orange-500/20">
                🔍
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Результат анализа</span>
                <h3 className="text-white font-bold text-xl">{result.diagnosis}</h3>
                <p className="text-slate-400 text-sm">Категория: {result.category}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Рекомендуемые действия</span>
              <div className="space-y-2">
                {result.suggestedTasks.map((t: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => onFoundProblem(result.category)}
                    className="w-full text-left bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-sm hover:border-orange-500 transition-all flex justify-between items-center"
                  >
                    {t}
                    <span className="text-orange-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setResult(null)} 
              className="w-full py-4 text-slate-500 text-xs font-bold uppercase hover:text-white transition-colors"
            >
              Переснять фото
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScanOverlay;
