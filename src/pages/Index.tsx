import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Play, Pause as PauseIcon, Settings, GraduationCap, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LEVEL_LABELS, LEVEL_WORDS } from '@/data/levels';
import { Badge } from '@/components/ui/badge';

import { getWordData } from '@/lib/api';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const data = storage.getData();
  const userLevel = data.user.level || 'primary';
  const learningLang = data.user.currentLanguage || 'en';
  const wordsCount = LEVEL_WORDS[userLevel].length;
  
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // 首次启动且词库为空时，自动获取入门单词
    const lang = data.user.currentLanguage || 'en';
    if ((!data.words[lang] || data.words[lang].length === 0) && !isInitializing) {
      const initialWords = ['hello', 'world', 'language', 'pause', 'learn'];
      const init = async () => {
        setIsInitializing(true);
        for (const word of initialWords) {
          await getWordData(word, lang);
        }
        setIsInitializing(false);
        // 强制重绘以更新单词数量
        window.location.reload();
      };
      init();
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((20 * 60 - timeLeft) / (20 * 60)) * 100;

  return (
    <div className="flex flex-col items-center px-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif font-bold tracking-tight">{getGreeting()}</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 mb-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-medium">{formatTime(timeLeft)}</span>
          <span className="text-sm text-muted-foreground mt-1">Focus Time</span>
        </div>
      </div>

      <div className="w-full bg-card rounded-2xl p-6 shadow-sm border border-border/50 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">今日计划</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-3 py-1 text-[10px] font-bold uppercase flex items-center gap-1">
            <GraduationCap className="h-3 w-3" /> {LEVEL_LABELS[userLevel]}
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">新单词</span>
            <span className="font-serif font-bold text-lg">{wordsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">待复习</span>
            <span className="font-serif font-bold text-lg">3</span>
          </div>
          <p className="text-sm text-muted-foreground italic pt-2">
            "今天你会邂逅 {wordsCount} 个新朋友，还有 3 个老朋友想见你"
          </p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button 
          className="w-full h-16 rounded-2xl text-lg font-medium shadow-sm transition-all active:scale-95"
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive && timeLeft === 20 * 60) {
              // Start session logic if needed
            }
          }}
        >
          {isActive ? (
            <><PauseIcon className="mr-2 h-5 w-5" /> 暂停学习</>
          ) : (
            <><Play className="mr-2 h-5 w-5" /> 开始学习</>
          )}
        </Button>
        
        {timeLeft < 20 * 60 && (
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl text-muted-foreground"
            onClick={() => {
              setIsActive(false);
              setTimeLeft(20 * 60);
            }}
          >
            重置计时
          </Button>
        )}

        <Button 
          variant="secondary"
          className="w-full h-14 rounded-2xl text-muted-foreground border-dashed border-2 bg-transparent"
          onClick={() => navigate('/extract')}
        >
          <Wand2 className="mr-2 h-5 w-5" /> 粘贴文章提取词汇
        </Button>
      </div>

      <p className="mt-12 text-sm text-muted-foreground font-serif italic opacity-60">
        Take a pause. Meet a few words.
      </p>
    </div>
  );
};

export default Index;
