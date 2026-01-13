
import React, { useState } from 'react';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет! Я HomeMaster AI. Опишите вашу проблему или прикрепите фото, и я помогу разобраться.', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Похоже, это вопрос по части сантехники. Рекомендую посмотреть раздел "Замена крана" или вызвать профильного специалиста.', sender: 'ai' }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">AI</div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-50 dark:border-slate-900 rounded-full"></div>
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-sm">Ваш помощник</h3>
          <p className="text-green-600 dark:text-green-500 text-[10px] uppercase font-bold">В сети</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
              m.sender === 'user' 
                ? 'bg-orange-500 text-white rounded-tr-none shadow-orange-500/10' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors">📎</button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Напишите сообщение..." 
          className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
        />
        <button 
          onClick={send}
          className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
           </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
