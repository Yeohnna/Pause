export interface UserSettings {
  dailyMinutes: number;
  theme: string;
  reminderTime: string;
  currentLanguage: string; // The language the user is learning
  dictionaryLanguage: string; // The language for translations (e.g., 'zh' for Chinese)
  streak: number;
  lastStudyDate: string;
  restPeriods: string[];
  level: 'primary' | 'middle' | 'high' | 'university' | 'advanced';
}

export interface WordData {
  id: string;
  word: string;
  phonetic: string;
  audioUrl: string;
  definitions: string[];
  chineseDefinition?: string;
  examples: string[];
  synonyms: { word: string; chinese?: string }[];
  similarWords: { word: string; note: string; chinese?: string }[];
}

export interface UserWordProgress {
  wordId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  easeFactor: number;
  interval: number;
  nextReview: string;
  reviewsCount: number;
  lastResult: 'correct' | 'hard' | 'forgot' | null;
  contextCard: string;
  sourceTag: string;
  addedDate: string;
}

export interface Notebook {
  id: string;
  title: string;
  coverColor: string;
  coverImage?: string;
  description: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
  wordCount: number;
}

export interface Writing {
  id: string;
  date: string;
  content: string;
  feedback: string;
  relatedWords: string[];
}

export interface StudySession {
  date: string;
  language: string;
  duration: number;
  newWords: number;
  reviewedWords: number;
}

export interface PauseData {
  version: number;
  user: UserSettings;
  words: Record<string, WordData[]>;
  userWords: Record<string, UserWordProgress[]>;
  writings: Writing[];
  studySessions: StudySession[];
  notebooks: Notebook[];
}
