import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Check, X, ArrowRight, Volume2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { WordData } from '@/types/types';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showChinese, setShowChinese] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'idle' | 'known' | 'fuzzy' | 'unknown'>('idle');
  const [showSpell, setShowSpell] = useState(false);
  const [spellResult, setSpellResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [reviewWords, setReviewWords] = useState<WordData[]>([]);

  useEffect(() => {
    // 从词库获取需要复习的单词
    const data = storage.getData();
    const lang = data.user.currentLanguage || 'en';
    const words = data.words[lang] || [];
    
    // 如果没有足够的单词，使用本地数据
    if (words.length === 0) {
      import('@/data/words').then(({ LOCAL_WORDS }) => {
        setReviewWords(LOCAL_WORDS[lang] || []);
      });
    } else {
      // 随机选择一些单词进行复习
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setReviewWords(shuffled.slice(0, Math.min(5, words.length)));
    }
  }, []);

  if (reviewWords.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground">暂无可复习的单词</p>
        <Button className="mt-4" onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  const current = reviewWords[step];

  const handleOptionSelect = (option: 'known' | 'fuzzy' | 'unknown') => {
    setSelectedOption(option);
    setShowChinese(true);
  };

  const handleSpellCheck = () => {
    if (userInput.toLowerCase().trim() === current.word.toLowerCase()) {
      setSpellResult('correct');
    } else {
      setSpellResult('wrong');
    }
  };

  const next = () => {
    if (step < reviewWords.length - 1) {
      setStep(step + 1);
      setUserInput('');
      setShowChinese(false);
      setSelectedOption('idle');
      setShowSpell(false);
      setSpellResult('idle');
    } else {
      alert('复习完成！');
      navigate('/');
    }
  };

  return (
    <div className="p-6 min-h-full flex flex-col bg-background">
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1 text-center">
          <span className="font-serif font-medium">复习模式</span>
          <p className="text-xs text-muted-foreground">{step + 1} / {reviewWords.length}</p>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {/* 拼写练习视图 */}
        {showSpell && (
          <Card className="w-full p-8 rounded-[2rem] shadow-xl border-none bg-card mb-8 animate-in fade-in duration-300">
            <Button 
              variant="ghost" 
              className="self-start mb-4 text-muted-foreground"
              onClick={() => {
                setShowSpell(false);
                setUserInput('');
                setSpellResult('idle');
              }}
            >
              <ArrowRight className="mr-2 h-4 w-4" /> 返回
            </Button>
            
            <h2 className="text-xl font-serif font-bold text-primary/70 mb-8">拼写练习</h2>
            
            {/* 显示中文提示 */}
            <div className="mb-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">中文释义</p>
              <p className="text-2xl font-medium text-foreground/80">{current.chineseDefinition || '暂无中文释义'}</p>
            </div>

            {/* 显示音标 */}
            <p className="text-xl text-muted-foreground font-serif mb-8 text-center">{current.phonetic}</p>
            
            {/* 播放按钮 */}
            <div className="flex justify-center mb-8">
              <Button 
                variant="secondary" 
                size="icon" 
                className="w-16 h-16 rounded-full shadow-sm"
                onClick={() => {
                  if (current.audioUrl) {
                    const audio = new Audio(current.audioUrl);
                    audio.play();
                  }
                }}
              >
                <Volume2 className="h-8 w-8 text-primary" />
              </Button>
            </div>

            {/* 输入框 */}
            <div className="w-full space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入单词拼写..."
                className="h-14 rounded-xl text-center text-xl font-serif"
                onKeyDown={(e) => e.key === 'Enter' && handleSpellCheck()}
                disabled={spellResult !== 'idle'}
                autoFocus
              />
              
              {spellResult === 'idle' ? (
                <Button className="w-full h-14 rounded-xl text-lg" onClick={handleSpellCheck}>
                  检查拼写
                </Button>
              ) : (
                <div className={cn(
                  "w-full h-14 rounded-xl flex items-center justify-center font-medium",
                  spellResult === 'correct' ? "bg-primary/20 text-primary" : "bg-destructive/10 text-destructive"
                )}>
                  {spellResult === 'correct' ? (
                    <><Check className="mr-2" /> 拼写正确！</>
                  ) : (
                    <><X className="mr-2" /> 错误！正确拼写: <span className="font-bold">{current.word}</span></>
                  )}
                </div>
              )}
            </div>

            {spellResult !== 'idle' && (
              <Button 
                className="w-full h-14 rounded-xl text-lg mt-4 animate-in slide-in-from-bottom-4" 
                onClick={next}
              >
                {spellResult === 'correct' ? '继续复习' : '再试一次'}
              </Button>
            )}
          </Card>
        )}

        {/* 主复习视图 */}
        {!showSpell && (
          <>
            <Card className="w-full p-8 rounded-[2rem] shadow-xl border-none bg-card mb-8">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">复习单词</span>
              </div>

              {/* 单词显示 */}
              <h1 className="text-5xl font-serif font-bold text-primary text-center mb-4">{current.word}</h1>
              <p className="text-xl text-muted-foreground font-serif text-center mb-6">{current.phonetic}</p>

              {/* 播放按钮 */}
              <div className="flex justify-center mb-8">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="w-16 h-16 rounded-full shadow-sm"
                  onClick={() => {
                    if (current.audioUrl) {
                      const audio = new Audio(current.audioUrl);
                      audio.play();
                    }
                  }}
                >
                  <Volume2 className="h-8 w-8 text-primary" />
                </Button>
              </div>

              {/* 中文释义（点击按钮后显示） */}
              {showChinese && (
                <div className="text-center mb-8 animate-in fade-in duration-300">
                  <p className="text-sm text-muted-foreground mb-2">中文释义</p>
                  <p className="text-2xl font-medium text-foreground/80">{current.chineseDefinition || '暂无中文释义'}</p>
                  
                  {/* 显示更多信息 */}
                  {current.definitions.length > 0 && (
                    <div className="mt-4 p-4 bg-secondary/50 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-2">释义</p>
                      <ul className="text-sm space-y-1">
                        {current.definitions.slice(0, 2).map((def, i) => (
                          <li key={i}>{def}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 三个按钮选项 */}
              {selectedOption === 'idle' ? (
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-xl text-sm"
                    onClick={() => handleOptionSelect('known')}
                  >
                    认识
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-xl text-sm"
                    onClick={() => handleOptionSelect('fuzzy')}
                  >
                    模糊
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-xl text-sm"
                    onClick={() => handleOptionSelect('unknown')}
                  >
                    不认识
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={cn(
                    "w-full h-14 rounded-xl flex items-center justify-center font-medium",
                    selectedOption === 'known' ? "bg-green-100 text-green-700" :
                    selectedOption === 'fuzzy' ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {selectedOption === 'known' ? <><Check className="mr-2" /> 已认识</> :
                     selectedOption === 'fuzzy' ? <span>模糊，需要复习</span> :
                     <><X className="mr-2" /> 不认识</>}
                  </div>
                  
                  <Button 
                    className="w-full h-14 rounded-xl text-lg"
                    onClick={() => setShowSpell(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> 拼写练习
                  </Button>
                </div>
              )}
            </Card>

            {/* 下一步按钮 */}
            {showChinese && (
              <Button className="w-full h-14 rounded-xl text-lg animate-in slide-in-from-bottom-4" onClick={next}>
                {step < reviewWords.length - 1 ? '下一个' : '完成复习'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Review;
