
import React, { useState } from 'react';
import { HistoryItem, User } from '../types';

interface ProfileScreenProps {
  history: HistoryItem[];
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ history, user, onLogin, onLogout }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const simulateGmailLogin = () => {
    setIsLoggingIn(true);
    // Имитация задержки ответа от Google
    setTimeout(() => {
      onLogin({
        name: 'Александр Мастер',
        email: 'alex.master@gmail.com',
        photoUrl: 'https://picsum.photos/seed/user/200/200'
      });
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0],
        email: email,
        photoUrl: `https://picsum.photos/seed/${email}/200/200`
      });
      setIsLoggingIn(false);
    }, 1200);
  };

  if (!user) {
    return (
      <div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-full flex flex-col animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center mt-10 mb-12 text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-xl mb-6">H</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">HomeMasterAI</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[220px]">
            Ваш персональный помощник в мире ремонта
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl mb-8 border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Вход
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'register' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Регистрация
          </button>
        </div>

        <div className="space-y-6">
          <button 
            onClick={simulateGmailLogin}
            disabled={isLoggingIn}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-slate-800 dark:text-white font-bold text-sm">Продолжить с Gmail</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-tighter">или почта</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="master@example.com"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Пароль</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {authMode === 'login' ? 'Войти в аккаунт' : 'Создать профиль'}
            </button>
          </form>
        </div>

        <p className="mt-auto pt-10 text-[10px] text-slate-400 dark:text-slate-600 uppercase font-bold text-center tracking-widest leading-loose">
          Используя сервис, вы соглашаетесь с <br/> <a href="#" className="underline text-slate-500 dark:text-slate-400">правилами обработки данных</a>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-full border-4 border-white dark:border-slate-800 shadow-xl mb-4 overflow-hidden relative">
           <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
           <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
             <span className="text-[10px] text-white">🏆</span>
           </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
        <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">{user.email}</p>
        <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-2 font-bold uppercase tracking-widest">Рейтинг: 4.8 • Сделано {history.length + 24} работ</p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Журнал работ</h3>
        </div>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                {item.imageUrl && (
                  <div className="w-full h-32 overflow-hidden border-b border-slate-100 dark:border-slate-700">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-black tracking-widest">{item.date} • {item.duration}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border border-green-200 dark:border-green-500/30">Готово</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-100 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-3xl mb-3 opacity-20">📸</div>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase font-bold tracking-widest">История работ пока пуста</p>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-1">Ваши фото появятся здесь</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Инструменты и навыки</h3>
        <div className="flex flex-wrap gap-2">
          {['Отвертки', 'Перфоратор', 'Электроника', 'Пайка', 'Чертежи'].map(skill => (
            <span key={skill} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-4 text-red-500 dark:text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
      >
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfileScreen;
