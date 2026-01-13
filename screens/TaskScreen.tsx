
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Task, HistoryItem } from '../types';

interface StepImageProps {
  src: string;
  alt: string;
  onImageChange: (newSrc: string) => void;
  isLocked?: boolean;
  hideActionButton?: boolean;
}

interface TaskScreenProps {
  task: Task;
  onBack: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onComplete: (item: HistoryItem) => void;
}

const StepImage: React.FC<StepImageProps> = ({ src, alt, onImageChange, isLocked, hideActionButton }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset error/loading state if src changes
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        onImageChange(compressed);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`w-full mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative aspect-video flex items-center justify-center group/img shadow-sm ${isLocked ? 'grayscale opacity-50' : ''}`}>
      {(loading || isProcessing) && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 z-10">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
            {isProcessing ? 'Оптимизация...' : 'Загрузка...'}
          </span>
        </div>
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50 dark:bg-slate-800/50 w-full h-full">
          <span className="text-3xl mb-2">🖼️</span>
          <span className="text-[10px] font-bold uppercase text-center px-4">Изображение обновляется или недоступно</span>
          <button 
            onClick={() => { setError(false); setLoading(true); }}
            className="mt-2 text-[9px] text-orange-500 font-black uppercase underline"
          >
            Попробовать еще раз
          </button>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${(loading || isProcessing) ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}

      {/* Camera Action Button */}
      {!isLocked && !hideActionButton && (
        <div className="absolute top-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 hover:bg-orange-500 transition-colors shadow-lg flex items-center gap-2"
            title="Заменить на свое фото"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">Своё фото</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange} 
          />
        </div>
      )}
    </div>
  );
};

const TaskScreen: React.FC<TaskScreenProps> = ({ task, onBack, onUpdateTask, onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const progress = useMemo(() => {
    const completed = task.steps.filter(s => s.completed).length;
    return Math.round((completed / task.steps.length) * 100);
  }, [task.steps]);

  const toggleStep = (id: string, index: number) => {
    const isPreviousCompleted = index === 0 || task.steps[index - 1].completed;
    
    if (!isPreviousCompleted && !task.steps[index].completed) {
      return;
    }

    const updatedTask = {
      ...task,
      steps: task.steps.map((s, idx) => {
        if (s.id === id) {
          return { ...s, completed: !s.completed };
        }
        if (idx > index && task.steps[index].completed === true) {
          return { ...s, completed: false };
        }
        return s;
      })
    };
    onUpdateTask(updatedTask);
  };

  const updateStepImage = (id: string, newSrc: string) => {
    const updatedTask = {
      ...task,
      steps: task.steps.map(s => s.id === id ? { ...s, imageUrl: newSrc } : s)
    };
    onUpdateTask(updatedTask);
  };

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    const userPhoto = [...task.steps].reverse().find(s => s.imageUrl && s.imageUrl.startsWith('data:'))?.imageUrl;

    onComplete({
      taskId: task.id,
      title: task.title,
      date: new Date().toLocaleDateString(),
      duration: `${duration} мин`,
      imageUrl: userPhoto
    });
    setIsFinished(true);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-500 bg-white dark:bg-slate-900">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-green-500/20">✅</div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Работа завершена!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Вы отлично справились с задачей "{task.title}".</p>
        
        <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Выполнено</span>
            <span className="text-green-600 dark:text-green-400 font-bold">100%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Потраченное время</span>
            <span className="text-slate-900 dark:text-white font-bold">{Math.round((Date.now() - startTime) / 60000)} мин</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button onClick={onBack} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all">Вернуться на главную</button>
          <button className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">Поделиться успехом</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pb-44">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Назад
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">{progress}% ГОТОВО</span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-10">
        <div className="px-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">{task.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="text-sm">⏱️</span> {task.estimatedTime}</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">📊</span> {task.difficulty}</span>
          </div>
        </div>
        
        <section className="bg-white dark:bg-slate-800 p-7 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">Что понадобится</h3>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <span className="text-[9px] font-black text-orange-500 block mb-3 uppercase tracking-widest">Инструменты</span>
              <div className="flex flex-wrap gap-2.5">
                {task.tools.map((t, idx) => (
                  <span key={idx} className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-[11px] font-bold px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[9px] font-black text-orange-500 block mb-3 uppercase tracking-widest">Материалы</span>
              <div className="flex flex-wrap gap-2.5">
                {task.materials.map((m, idx) => (
                  <span key={idx} className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-500/20 shadow-sm">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Порядок действий</h3>
          {task.steps.map((step, idx) => {
            const isLocked = idx > 0 && !task.steps[idx - 1].completed;
            const isFirstStep = idx === 0;
            
            return (
              <div 
                key={step.id} 
                className={`group flex flex-col p-7 rounded-[2.5rem] border transition-all duration-500 ${
                  step.completed 
                    ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 opacity-60 scale-[0.98]' 
                    : isLocked
                      ? 'bg-slate-100/30 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-40 grayscale pointer-events-none'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none'
                }`}
              >
                <div className="flex items-start gap-6">
                  <button 
                    disabled={isLocked}
                    onClick={() => toggleStep(step.id, idx)}
                    className={`flex-shrink-0 w-12 h-12 rounded-[1.25rem] border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                      step.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isLocked 
                          ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                          : 'border-slate-200 dark:border-slate-600 text-transparent hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isLocked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transform transition-transform duration-500 ${step.completed ? 'scale-110' : 'scale-0'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 pt-1">
                    <span className={`text-[10px] font-black block mb-2 uppercase tracking-widest transition-colors ${step.completed ? 'text-slate-400' : isLocked ? 'text-slate-400' : 'text-orange-500'}`}>
                      Шаг {idx + 1} {isLocked && '🔒'}
                    </span>
                    <p className={`text-base leading-relaxed font-bold tracking-tight transition-all ${step.completed ? 'text-slate-400 line-through' : isLocked ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {step.text}
                    </p>
                  </div>
                </div>
                
                {step.imageUrl && (
                  <StepImage 
                    isLocked={isLocked}
                    hideActionButton={isFirstStep}
                    src={step.imageUrl} 
                    alt={`Иллюстрация к шагу ${idx + 1}`} 
                    onImageChange={(newSrc) => updateStepImage(step.id, newSrc)}
                  />
                )}
              </div>
            );
          })}
        </section>
      </div>

      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40 transition-all duration-500 transform ${progress === 100 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <button 
          onClick={handleFinish}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-green-500/50 hover:from-green-500 hover:to-green-400 active:scale-95 transition-all flex items-center justify-center gap-4 text-lg uppercase tracking-widest"
        >
          <span>✨ Завершить работу</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskScreen;
