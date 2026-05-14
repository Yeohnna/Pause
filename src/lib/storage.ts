import { PauseData, UserWordProgress, Notebook } from '../types/types';

const STORAGE_KEY = 'pause_data';

const INITIAL_DATA: PauseData = {
  version: 1,
  user: {
    dailyMinutes: 20,
    theme: 'morning_study',
    reminderTime: 'evening',
    currentLanguage: 'en',
    dictionaryLanguage: 'zh',
    streak: 0,
    lastStudyDate: '',
    restPeriods: [],
    level: 'primary',
  },
  words: { en: [] },
  userWords: { en: [] },
  writings: [],
  studySessions: [],
  notebooks: [
    {
      id: 'default-notebook',
      title: '我的词汇本',
      coverColor: '#8B4513',
      description: '收集所有学习过的单词',
      tags: ['英语', '学习'],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: 0,
    },
  ],
};

export const storage = {
  getData: (): PauseData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_DATA;
    try {
      const parsed = JSON.parse(data);
      // 添加 notebooks 如果不存在
      if (!parsed.notebooks) {
        parsed.notebooks = INITIAL_DATA.notebooks;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse storage data', e);
      return INITIAL_DATA;
    }
  },

  saveData: (data: PauseData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateWordProgress: (lang: string, progress: UserWordProgress) => {
    const data = storage.getData();
    if (!data.userWords[lang]) data.userWords[lang] = [];
    const index = data.userWords[lang].findIndex(p => p.wordId === progress.wordId);
    if (index >= 0) {
      data.userWords[lang][index] = progress;
    } else {
      data.userWords[lang].push(progress);
    }
    storage.saveData(data);
  },

  // 笔记本相关方法
  addNotebook: (notebook: Omit<Notebook, 'id' | 'createdAt' | 'lastModified' | 'wordCount'>) => {
    const data = storage.getData();
    const newNotebook: Notebook = {
      ...notebook,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: 0,
    };
    data.notebooks.push(newNotebook);
    storage.saveData(data);
    return newNotebook;
  },

  updateNotebook: (notebookId: string, updates: Partial<Notebook>) => {
    const data = storage.getData();
    const index = data.notebooks.findIndex(n => n.id === notebookId);
    if (index >= 0) {
      data.notebooks[index] = {
        ...data.notebooks[index],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      storage.saveData(data);
      return data.notebooks[index];
    }
    return null;
  },

  deleteNotebook: (notebookId: string) => {
    const data = storage.getData();
    data.notebooks = data.notebooks.filter(n => n.id !== notebookId);
    storage.saveData(data);
  },
};

export const sm2 = {
  calculateNextReview: (card: UserWordProgress, result: 'correct' | 'hard' | 'forgot'): UserWordProgress => {
    const newCard = { ...card };
    
    if (result === 'forgot') {
      newCard.interval = 1;
      newCard.easeFactor = Math.max(1.3, newCard.easeFactor - 0.2);
      newCard.status = 'learning';
    } else if (result === 'hard') {
      newCard.interval = Math.max(1, Math.round(newCard.interval * 1.2));
      newCard.easeFactor = Math.max(1.3, newCard.easeFactor - 0.15);
      newCard.status = 'review';
    } else if (result === 'correct') {
      if (newCard.interval === 0) {
        newCard.interval = 1;
      } else if (newCard.interval === 1) {
        newCard.interval = 3;
      } else {
        newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
      }
      newCard.status = newCard.interval > 30 ? 'mastered' : 'review';
    }
    
    newCard.lastResult = result;
    newCard.reviewsCount += 1;
    newCard.nextReview = new Date(Date.now() + newCard.interval * 86400000).toISOString();
    
    return newCard;
  }
};
