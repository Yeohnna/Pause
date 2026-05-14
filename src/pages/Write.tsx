import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, Send } from 'lucide-react';

const Write: React.FC = () => {
  const [content, setContent] = useState('');
  const recommendedWords = ['ephemeral', 'resilient', 'eloquent'];

  return (
    <div className="p-6 pb-24 min-h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">写作沙盒</h1>
        <p className="text-muted-foreground text-sm">尝试在书写中运用你学过的词汇</p>
      </header>

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-primary/70 uppercase tracking-widest">
          <Sparkles className="h-3 w-3" /> 建议运用的词汇
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendedWords.map(word => (
            <Badge 
              key={word} 
              variant="secondary" 
              className="px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setContent(prev => prev + ' ' + word)}
            >
              {word}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="flex-1 min-h-[400px] rounded-3xl p-6 shadow-inner border-none bg-secondary/10 flex flex-col">
        <Textarea 
          placeholder="开始你的写作..."
          className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-lg leading-relaxed font-serif"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{content.length} characters</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                alert('文章已保存');
              }}
            >
              <Save className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button 
              size="sm" 
              className="rounded-full px-6"
              onClick={() => {
                alert('语法分析建议：你的文章写得很棒！尝试多用一些 "ephemeral" 这样的词汇。');
              }}
            >
              分析 <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Write;
