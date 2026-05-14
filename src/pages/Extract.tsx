import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronLeft, Wand2, Plus, Check, Loader2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { fetchWord } from '@/lib/api';

const Extract: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [extractedWords, setExtractedWords] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [chinese, setChinese] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExtract = () => {
    if (!text.trim()) return;
    setIsExtracting(true);
    setTimeout(() => {
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3); // Changed from 5 to 3
      setExtractedWords([...new Set(words)].slice(0, 15));
      setIsExtracting(false);
    }, 1000);
  };

  const handleSelectWord = async (word: string) => {
    setSelectedWord(word);
    setChinese('');
    setIsDialogOpen(true);
    setIsFetching(true);
    
    const data = storage.getData();
    const fetched = await fetchWord(word, data.user.currentLanguage || 'en');
    if (fetched && fetched.chineseDefinition) {
      setChinese(fetched.chineseDefinition);
    }
    setIsFetching(false);
  };

  const handleAddWord = () => {
    const data = storage.getData();
    const currentLang = data.user.currentLanguage || 'en';
    if (!data.words[currentLang]) data.words[currentLang] = [];

    const wordEntry = {
      id: crypto.randomUUID(),
      word: selectedWord,
      phonetic: '',
      audioUrl: '',
      definitions: [],
      chineseDefinition: chinese,
      examples: [],
      synonyms: [],
      similarWords: []
    };
    
    if (!data.words[currentLang].find(w => w.word === selectedWord)) {
      data.words[currentLang].push(wordEntry);
      storage.saveData(data);
      toast.success(`${selectedWord} 已加入词库`);
    } else {
      toast.info(`${selectedWord} 已在词库中`);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 pb-24 min-h-full flex flex-col bg-background">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-serif font-bold">一键提取生词</h1>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">粘贴文章内容</label>
          <Textarea 
            placeholder="将你正在阅读的文章粘贴到这里..."
            className="min-h-[200px] rounded-2xl p-4 bg-secondary/20 border-none resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button 
          className="w-full h-14 rounded-xl text-lg" 
          onClick={handleExtract}
          disabled={isExtracting || !text.trim()}
        >
          {isExtracting ? '提取中...' : <><Wand2 className="mr-2 h-5 w-5" /> 开始提取</>}
        </Button>

        {extractedWords.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-serif font-bold">提取到的潜在生词</h3>
            <div className="flex flex-wrap gap-2">
              {extractedWords.map((word, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSelectWord(word)}
                >
                  {word} <Plus className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>添加单词: {selectedWord}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">中文释义</label>
              <div className="relative">
                <Input 
                  placeholder={isFetching ? "正在自动获取释义..." : "输入中文释义..."} 
                  value={chinese}
                  onChange={(e) => setChinese(e.target.value)}
                  disabled={isFetching}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                />
                {isFetching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddWord} disabled={isFetching}>确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Extract;
