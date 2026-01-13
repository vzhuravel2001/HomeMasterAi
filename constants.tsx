
import { Category, Task } from './types';

export const CATEGORIES: Category[] = [
  { id: 'electrical', name: 'Электрика', icon: '⚡', color: 'bg-orange-500' },
  { id: 'plumbing', name: 'Сантехника', icon: '🚰', color: 'bg-blue-500' },
  { id: 'design', name: 'Дизайн и ремонт', icon: '🎨', color: 'bg-purple-500' },
  { id: 'furniture', name: 'Мебель и сборка', icon: '🪑', color: 'bg-amber-700' },
  { id: 'appliances', name: 'Бытовая техника', icon: '🔌', color: 'bg-slate-500' },
  { id: 'other', name: 'Другое', icon: '🛠️', color: 'bg-emerald-600' },
];

export const TASKS: Task[] = [
  {
    id: 't1',
    categoryId: 'electrical',
    title: 'Замена выключателя или розетки',
    difficulty: 'Medium',
    estimatedTime: '25 мин',
    tools: ['Индикаторная отвертка', 'Набор отверток', 'Плоскогубцы'],
    materials: ['Новый выключатель/розетка', 'Изолента', 'Подрозетник (при необходимости)'],
    steps: [
      { 
        id: 's1', 
        text: 'Отключи электричество на щитке. Обязательно проверь отсутствие напряжения в сети индикаторной отверткой перед началом работ.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's2', 
        text: 'Сними внешнюю декоративную панель и рамку изделия, используя плоскую отвертку.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's3', 
        text: 'Ослабь винты разжимных лапок и вытащи механизм из стены.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's4', 
        text: 'Сфотографируй схему подключения. Отсоедини провода от старого зажима.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's5', 
        text: 'Зачисти концы проводов и плотно зажми их в клеммах нового изделия согласно схеме.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's6', 
        text: 'Установи механизм в подрозетник, выровняй по уровню и затяни крепления. Верни рамку и клавиши на место.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 's7', 
        text: 'Подай питание и проверь работоспособность тестером или включением прибора.', 
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
      },
    ]
  }
];
