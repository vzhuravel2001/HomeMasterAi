
import React, { useState, useEffect } from 'react';
import { AppTab, Category, Task, HistoryItem, User } from './types';
import { CATEGORIES, TASKS } from './constants';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import TaskScreen from './screens/TaskScreen';
import MapsScreen from './screens/MapsScreen';
import ChatScreen from './screens/ChatScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AIScanOverlay from './components/AIScanOverlay';
import ColorPickerOverlay from './components/ColorPickerOverlay';
import SplashScreen from './components/SplashScreen';

const TASKS_STORAGE_KEY = 'hm_tasks_v2';
const HISTORY_STORAGE_KEY = 'hm_history_v2';
const USER_STORAGE_KEY = 'hm_user_v2';

const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAIScan, setShowAIScan] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load tasks from storage", e);
    }
    return TASKS;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    // Устанавливаем координаты для CSS анимации
    const root = document.documentElement;
    root.style.setProperty('--click-x', `${x}px`);
    root.style.setProperty('--click-y', `${y}px`);

    // Если браузер поддерживает View Transition API
    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        if (nextMode) {
          root.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          root.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    } else {
      // Фолбэк для старых браузеров
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      if (nextMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks:", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, [history]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const renderScreen = () => {
    if (selectedTaskId && selectedTask) {
      return (
        <TaskScreen 
          task={selectedTask} 
          onBack={() => setSelectedTaskId(null)} 
          onUpdateTask={handleUpdateTask}
          onComplete={(item) => {
            setHistory(prev => [item, ...prev]);
            setSelectedTaskId(null);
          }}
        />
      );
    }

    if (selectedCategory) {
      return (
        <CategoryScreen 
          category={selectedCategory} 
          tasks={tasks.filter(t => t.categoryId === selectedCategory.id)}
          onBack={() => setSelectedCategory(null)}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
        />
      );
    }

    switch (activeTab) {
      case AppTab.HOME:
        return <HomeScreen onSelectCategory={setSelectedCategory} onOpenColorPicker={() => setShowColorPicker(true)} />;
      case AppTab.MAPS:
        return <MapsScreen />;
      case AppTab.CHAT:
        return <ChatScreen />;
      case AppTab.PROJECTS:
        return <ProjectsScreen />;
      case AppTab.PROFILE:
        return <ProfileScreen history={history} user={user} onLogin={setUser} onLogout={() => setUser(null)} />;
      default:
        return <HomeScreen onSelectCategory={setSelectedCategory} onOpenColorPicker={() => setShowColorPicker(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative border-x border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-700">
      {isInitialLoading && <SplashScreen />}
      
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-6 py-4 flex justify-between items-center z-20 sticky top-0 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">H</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">HomeMaster<span className="text-orange-500">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-orange-400 shadow-sm border border-slate-200 dark:border-slate-700"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button 
            onClick={() => setShowAIScan(true)}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white p-2.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center border border-orange-400 dark:border-orange-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto pb-20 custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-opacity duration-700 ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        {renderScreen()}
      </main>

      <nav className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 h-20 flex justify-around items-center px-4 safe-area-bottom fixed bottom-0 w-full max-w-md transition-transform duration-700 ${isInitialLoading ? 'translate-y-full' : 'translate-y-0'}`}>
        <NavButton active={activeTab === AppTab.HOME} icon="🏠" label="Домой" onClick={() => {setActiveTab(AppTab.HOME); setSelectedCategory(null); setSelectedTaskId(null);}} />
        <NavButton active={activeTab === AppTab.MAPS} icon="📍" label="Карты" onClick={() => setActiveTab(AppTab.MAPS)} />
        <NavButton active={activeTab === AppTab.CHAT} icon="💬" label="Чат" onClick={() => setActiveTab(AppTab.CHAT)} />
        <NavButton active={activeTab === AppTab.PROJECTS} icon="👷" label="Объекты" onClick={() => setActiveTab(AppTab.PROJECTS)} />
        <NavButton active={activeTab === AppTab.PROFILE} icon="👤" label="Профиль" onClick={() => setActiveTab(AppTab.PROFILE)} />
      </nav>

      {showAIScan && (
        <AIScanOverlay 
          onClose={() => setShowAIScan(false)} 
          onFoundProblem={(categoryName) => {
            const cat = CATEGORIES.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase())) || CATEGORIES[0];
            setSelectedCategory(cat);
            setActiveTab(AppTab.HOME);
            setShowAIScan(false);
          }}
        />
      )}

      {showColorPicker && (
        <ColorPickerOverlay onClose={() => setShowColorPicker(false)} />
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: string; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[64px] transition-all">
    <span className={`text-2xl ${active ? 'scale-110 opacity-100' : 'opacity-40 grayscale'}`}>{icon}</span>
    <span className={`text-[10px] font-medium uppercase tracking-wider ${active ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}>{label}</span>
    {active && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-0.5 shadow-sm"></div>}
  </button>
);

export default App;
