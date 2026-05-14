import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordData } from '@/types/types';
import { fetchWord } from '@/lib/api';
import { storage } from '@/lib/storage';
import { LEVEL_LABELS } from '@/data/levels';
import { LOCAL_WORDS } from '@/data/words';
import WordCard from '@/components/WordCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Trophy, BookOpen } from 'lucide-react';

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const data = storage.getData();
  const userLevel = data.user.level || 'primary';
  const learningLang = data.user.currentLanguage || 'en';
  
  // 从词库获取单词，如果词库为空则使用本地数据
  const [wordsToLearn, setWordsToLearn] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 获取学习单词列表
    const storedWords = data.words[learningLang] || [];
    const localWords = LOCAL_WORDS[learningLang] || [];
    
    // 优先使用用户导入的单词，否则使用本地数据
    if (storedWords.length > 0) {
      // 打乱顺序并取前10个
      const shuffled = [...storedWords].sort(() => Math.random() - 0.5);
      setWordsToLearn(shuffled.slice(0, Math.min(10, shuffled.length)).map(w => w.word));
    } else {
      // 使用本地数据
      const shuffled = [...localWords].sort(() => Math.random() - 0.5);
      setWordsToLearn(shuffled.slice(0, 10).map(w => w.word));
    }
  }, [learningLang, data.user.level]);

  useEffect(() => {
    if (wordsToLearn.length > 0 && currentIndex < wordsToLearn.length) {
      loadWord(wordsToLearn[currentIndex]);
    } else if (wordsToLearn.length === 0) {
      // 如果没有单词，自动导入本地数据
      const localWords = LOCAL_WORDS[learningLang] || [];
      const shuffled = [...localWords].sort(() => Math.random() - 0.5);
      setWordsToLearn(shuffled.slice(0, 10).map(w => w.word));
    }
  }, [currentIndex, wordsToLearn]);

  const loadWord = async (word: string) => {
    setLoading(true);
    const apiData = await fetchWord(word, learningLang);
    setCurrentWord(apiData);
    setLoading(false);
  };

  const handleKnown = (updatedWord?: WordData) => {
    if (updatedWord) {
      const storageData = storage.getData();
      const currentLang = storageData.user.currentLanguage || 'en';
      if (!storageData.words[currentLang]) storageData.words[currentLang] = [];
      
      const wordIndex = storageData.words[currentLang].findIndex(w => w.word === updatedWord.word);
      if (wordIndex >= 0) {
        storageData.words[currentLang][wordIndex] = updatedWord;
      } else {
        storageData.words[currentLang].push(updatedWord);
      }
      storage.saveData(storageData);
    }

    if (currentIndex < wordsToLearn.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleForgot = (updatedWord?: WordData) => {
    if (updatedWord) {
      const storageData = storage.getData();
      const currentLang = storageData.user.currentLanguage || 'en';
      if (!storageData.words[currentLang]) storageData.words[currentLang] = [];
      
      const wordIndex = storageData.words[currentLang].findIndex(w => w.word === updatedWord.word);
      if (wordIndex >= 0) {
        storageData.words[currentLang][wordIndex] = updatedWord;
      } else {
        storageData.words[currentLang].push(updatedWord);
      }
      storage.saveData(storageData);
    }

    if (currentIndex < wordsToLearn.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  if (sessionCompleted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">太棒了！</h2>
        <p className="text-muted-foreground mb-8">
          你已经完成了今天的学习任务。<br/>
          养分已吸收完毕，明天见。
        </p>
        <Button className="w-full h-14 rounded-2xl" onClick={() => navigate('/')}>
          回到首页
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-background p-6">
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
              {wordsToLearn.length > 0 ? '今日学习' : LEVEL_LABELS[userLevel]}
            </span>
            <span className="text-sm font-medium text-muted-foreground mt-0.5">
              {currentIndex + 1} / {wordsToLearn.length}
            </span>
          </div>
          <div className="w-full bg-secondary h-1 mt-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / Math.max(wordsToLearn.length, 1)) * 100}%` }}
            />
          </div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-serif italic">正在为你准备单词...</p>
          </div>
        ) : currentWord ? (
          <WordCard word={currentWord} onKnown={handleKnown} onForgot={handleForgot} />
        ) : (
          <div className="text-center space-y-4">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">暂无可用的单词</p>
            <p className="text-sm text-muted-foreground">请先在词库中添加单词</p>
            <Button onClick={() => navigate('/wordbank')}>去词库添加单词</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Learn;
