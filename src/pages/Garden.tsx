import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Flower2, Calendar, BookOpen, Flame, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';

const Garden: React.FC = () => {
  const data = storage.getData();
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  const totalWords = data.words.en?.length || 0;
  const masteredWords = Math.floor(totalWords * 0.6);
  const learningWords = totalWords - masteredWords;

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">语言花园</h1>
        <p className="text-muted-foreground text-sm">每一个掌握的词汇，都是一颗绽放的花</p>
      </header>

      {/* Main Garden Card */}
      <Card 
        className="w-full aspect-[4/5] relative rounded-[2.5rem] bg-gradient-to-b from-sky-100/50 to-emerald-50/50 border-none shadow-inner overflow-hidden flex items-center justify-center mb-8 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowStats(!showStats)}
      >
        <div className="absolute bottom-0 w-full h-1/4 bg-emerald-100/30 blur-2xl" />
        <div className="relative flex flex-col items-center">
          <Flower2 className="h-32 w-32 text-primary animate-pulse" strokeWidth={1.5} />
          <div className="mt-4 text-center">
            <p className="text-lg font-serif font-bold text-primary">English Garden</p>
            <p className="text-xs text-muted-foreground">正在茁壮成长</p>
          </div>
          
          {/* Stats Preview */}
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{data.user.streak}</p>
              <p className="text-xs text-muted-foreground">连续打卡</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalWords}</p>
              <p className="text-xs text-muted-foreground">总词汇量</p>
            </div>
          </div>
        </div>
        
        {/* Floating decorations */}
        <div className="absolute top-10 right-10 opacity-20"><Flower2 className="h-8 w-8" /></div>
        <div className="absolute bottom-20 left-10 opacity-20"><Flower2 className="h-10 w-10" /></div>
      </Card>

      {/* Stats Detail Panel */}
      {showStats && (
        <Card className="w-full p-6 rounded-2xl border-none shadow-sm bg-card mb-8 animate-in fade-in duration-300">
          <h2 className="text-lg font-serif font-bold mb-4">我的学习统计</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-orange-400" />
                <span>连续打卡</span>
              </div>
              <span className="font-bold text-primary">{data.user.streak} 天</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span>总词汇量</span>
              </div>
              <span className="font-bold text-primary">{totalWords} 个</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-400" />
                <span>已掌握</span>
              </div>
              <span className="font-bold text-primary">{masteredWords} 个</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-yellow-400" />
                <span>正在学习</span>
              </div>
              <span className="font-bold text-primary">{learningWords} 个</span>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="p-4 rounded-2xl border-none shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/learn')}
        >
          <Flame className="h-5 w-5 text-orange-400 mb-2" />
          <p className="text-2xl font-serif font-bold">{data.user.streak} 天</p>
          <p className="text-xs text-muted-foreground">连续打卡</p>
          <Button variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80">
            去学习 <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Card>
        
        <Card 
          className="p-4 rounded-2xl border-none shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/review')}
        >
          <BookOpen className="h-5 w-5 text-blue-400 mb-2" />
          <p className="text-2xl font-serif font-bold">{totalWords} 个</p>
          <p className="text-xs text-muted-foreground">总词汇量</p>
          <Button variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80">
            去复习 <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Card>
        
        <Card 
          className="p-4 rounded-2xl border-none shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/wordbank')}
        >
          <Calendar className="h-5 w-5 text-purple-400 mb-2" />
          <p className="text-2xl font-serif font-bold">{masteredWords} 个</p>
          <p className="text-xs text-muted-foreground">已掌握</p>
          <Button variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80">
            查看词库 <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Card>
        
        <Card 
          className="p-4 rounded-2xl border-none shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/write')}
        >
          <TrendingUp className="h-5 w-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-serif font-bold">{learningWords} 个</p>
          <p className="text-xs text-muted-foreground">正在学习</p>
          <Button variant="ghost" className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80">
            去写作 <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Garden;
