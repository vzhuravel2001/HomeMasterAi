
export enum AppTab {
  HOME = 'home',
  MAPS = 'maps',
  CHAT = 'chat',
  PROJECTS = 'projects',
  PROFILE = 'profile'
}

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  tools: string[];
  materials: string[];
  steps: TaskStep[];
  difficulty: 'Low' | 'Medium' | 'High';
  estimatedTime: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface HistoryItem {
  taskId: string;
  title: string;
  date: string;
  duration: string;
  imageUrl?: string;
}

export interface User {
  name: string;
  email: string;
  photoUrl: string;
}
