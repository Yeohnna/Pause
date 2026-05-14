import React, { useState, useEffect } from 'react';
import { WordData } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Volume2, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordCardProps {
  word: WordData;
  onKnown: (updatedWord?: WordData) => void;
  onForgot: (updatedWord?: WordData) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onKnown, onForgot }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [view, setView] = useState<'main' | 'synonyms' | 'similar'>('main');
  const [chinese, setChinese] = useState(word.chineseDefinition || '');
  const [isEditingChinese, setIsEditingChinese] = useState(false);
  const [showSpell, setShowSpell] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [spellResult, setSpellResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showChineseHint, setShowChineseHint] = useState(false);

  useEffect(() => {
    setChinese(word.chineseDefinition || '');
    setShowDetails(false);
    setView('main');
    setShowSpell(false);
    setUserInput('');
    setSpellResult('idle');
    setShowChineseHint(false);
  }, [word]);

  const playAudio = (slow = false) => {
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      audio.playbackRate = slow ? 0.75 : 1;
      audio.play();
    }
  };

  const handleSaveChinese = () => {
    setIsEditingChinese(false);
  };

  const handleSpellCheck = () => {
    if (userInput.toLowerCase().trim() === word.word.toLowerCase()) {
      setSpellResult('correct');
    } else {
      setSpellResult('wrong');
    }
  };

  const handleNext = () => {
    if (spellResult === 'correct') {
      onKnown({ ...word, chineseDefinition: chinese });
    } else {
      onForgot({ ...word, chineseDefinition: chinese });
    }
  };

  return (
    <div className="relative w-full h-[600px] perspective-1000">
      {/* 拼写练习视图 */}
      {showSpell && (
        <Card className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-center p-8 rounded-[2rem] bg-card border-none shadow-xl animate-in fade-in duration-300">
          <Button 
            variant="ghost" 
            className="self-start mb-4 text-muted-foreground"
            onClick={() => {
              setShowSpell(false);
              setUserInput('');
              setSpellResult('idle');
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
          
          <h2 className="text-xl font-serif font-bold text-primary/70 mb-8">拼写练习</h2>
          
          {/* 显示中文提示 */}
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">中文释义</p>
            <p className="text-2xl font-medium text-foreground/80">{chinese || '暂无中文释义'}</p>
          </div>

          {/* 显示音标 */}
          <p className="text-xl text-muted-foreground font-serif mb-8">{word.phonetic}</p>
          
          {/* 播放按钮 */}
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-16 h-16 rounded-full shadow-sm mb-8"
            onClick={() => playAudio()}
          >
            <Volume2 className="h-8 w-8 text-primary" />
          </Button>

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
                  <><X className="mr-2" /> 错误！正确拼写: <span className="font-bold">{word.word}</span></>
                )}
              </div>
            )}
          </div>

          {spellResult !== 'idle' && (
            <Button 
              className="w-full h-14 rounded-xl text-lg mt-4 animate-in slide-in-from-bottom-4" 
              onClick={handleNext}
            >
              {spellResult === 'correct' ? '继续学习' : '再试一次'}
            </Button>
          )}
        </Card>
      )}

      {/* 主学习视图 */}
      <Card className={cn(
        "w-full h-full flex flex-col items-center justify-between p-8 transition-all duration-500 ease-in-out shadow-xl rounded-[2rem] bg-card border-none overflow-hidden",
        view === 'synonyms' && "-translate-x-full opacity-0",
        view === 'similar' && "translate-x-full opacity-0"
      )}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full">
          <h1 className="text-5xl font-serif font-bold text-primary">{word.word}</h1>
          <p className="text-xl text-muted-foreground font-serif">{word.phonetic}</p>
          
          <div className="mt-4 text-center w-full px-4">
            {isEditingChinese ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={chinese} 
                  onChange={(e) => setChinese(e.target.value)}
                  className="bg-secondary/50 border-none rounded-lg p-2 text-center text-lg w-full outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="输入中文释义..."
                  autoFocus
                  onBlur={handleSaveChinese}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveChinese()}
                />
              </div>
            ) : (
              <p 
                className="text-2xl font-medium text-foreground/80 cursor-pointer hover:text-primary transition-colors min-h-[1.5em]"
                onClick={() => setIsEditingChinese(true)}
              >
                {chinese || "点击添加中文释义"}
              </p>
            )}
          </div>

          <Button 
            variant="secondary" 
            size="icon" 
            className="w-16 h-16 rounded-full shadow-sm hover:scale-105 transition-transform"
            onClick={() => playAudio()}
            onContextMenu={(e) => {
              e.preventDefault();
              playAudio(true);
            }}
          >
            <Volume2 className="h-8 w-8 text-primary" />
          </Button>

          {!showDetails && (
            <Button 
              variant="ghost" 
              className="text-muted-foreground mt-8 animate-bounce"
              onClick={() => setShowDetails(true)}
            >
              <ChevronDown className="mr-2 h-4 w-4" /> 它的意思是...
            </Button>
          )}
        </div>

        {/* Details Section */}
        <div className={cn(
          "w-full transition-all duration-500 ease-in-out overflow-y-auto",
          showDetails ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-6 pt-4 pb-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">释义</h3>
              <ul className="space-y-2">
                {word.definitions.slice(0, 3).map((def, i) => (
                  <li key={i} className="text-base leading-relaxed">{def}</li>
                ))}
              </ul>
            </div>
            
            {word.examples.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">例句</h3>
                <div className="bg-secondary/50 rounded-2xl p-4 italic text-sm">
                   "{word.examples[0]}"
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4 mt-auto">
          {showDetails && (
             <Button 
               variant="ghost" 
               size="sm"
               className="text-muted-foreground"
               onClick={() => setShowDetails(false)}
             >
               <ChevronUp className="h-4 w-4" />
             </Button>
          )}
          
          <div className="w-full grid grid-cols-2 gap-3">
            <Button 
              className="h-14 rounded-2xl text-lg font-medium shadow-md"
              onClick={() => setShowSpell(true)}
            >
              <Pencil className="mr-2 h-4 w-4" /> 拼写练习
            </Button>
            <Button 
              variant="outline"
              className="h-14 rounded-2xl text-lg font-medium"
              onClick={() => onForgot({ ...word, chineseDefinition: chinese })}
            >
              标记不认识
            </Button>
          </div>
          
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-medium shadow-md bg-primary hover:bg-primary/90"
            onClick={() => onKnown({ ...word, chineseDefinition: chinese })}
          >
            认识它
          </Button>
          
          <div className="flex justify-between w-full px-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            <button onClick={() => setView('synonyms')} className="flex items-center hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3 mr-1" /> 同义词
            </button>
            <button onClick={() => setView('similar')} className="flex items-center hover:text-primary transition-colors">
              形近词 <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      </Card>

      {/* Panels for Swipe (simplified implementation) */}
      {view === 'synonyms' && (
        <Card className="absolute inset-0 z-10 w-full h-full p-8 flex flex-col rounded-[2rem] bg-card border-none shadow-xl animate-in slide-in-from-left duration-300">
          <Button variant="ghost" className="self-start mb-4" onClick={() => setView('main')}>
            <ArrowRight className="mr-2 h-4 w-4" /> 返回
          </Button>
          <h2 className="text-2xl font-serif font-bold mb-6 text-primary">同义词</h2>
          <div className="flex flex-wrap gap-3">
            {word.synonyms.map((s, i) => (
              <span key={i} className="px-4 py-2 bg-secondary rounded-full text-sm">
                {s.word}
                {s.chinese && <span className="text-muted-foreground ml-1">({s.chinese})</span>}
              </span>
            ))}
            {word.synonyms.length === 0 && <p className="text-muted-foreground">暂无同义词</p>}
          </div>
        </Card>
      )}

      {view === 'similar' && (
        <Card className="absolute inset-0 z-10 w-full h-full p-8 flex flex-col rounded-[2rem] bg-card border-none shadow-xl animate-in slide-in-from-right duration-300">
          <Button variant="ghost" className="self-end mb-4" onClick={() => setView('main')}>
            返回 <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-serif font-bold mb-6 text-primary">形近词</h2>
          <div className="space-y-4">
            {word.similarWords.map((sw, i) => (
              <div key={i} className="p-4 bg-secondary rounded-2xl">
                <p className="font-bold text-primary">
                  {sw.word}
                  {sw.chinese && <span className="text-muted-foreground ml-2">({sw.chinese})</span>}
                </p>
                <p className="text-sm text-muted-foreground">{sw.note}</p>
              </div>
            ))}
            {word.similarWords.length === 0 && <p className="text-muted-foreground">暂无形近词</p>}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WordCard;
