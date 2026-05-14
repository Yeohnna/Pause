import React, { useState, useRef } from 'react';
import { storage } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Plus, ChevronLeft, ChevronRight, Trash2, Edit3, X, Sparkles, Upload, FileText } from 'lucide-react';
import { fetchWord } from '@/lib/api';
import { LOCAL_WORDS } from '@/data/words';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Notebook, WordData, UserWordProgress } from '@/types/types';

// 莫兰迪色系 - 柔和、低饱和度的高级配色
const MORANDI_COLORS = [
  '#C4A77D', // 莫兰迪黄
  '#A8A8A8', // 莫兰迪灰
  '#B5A397', // 莫兰迪棕
  '#C9B896', // 莫兰迪奶油
  '#8BA8B7', // 莫兰迪蓝
  '#9CB5A0', // 莫兰迪绿
  '#C4A4A4', // 莫兰迪粉
  '#A69F97', // 莫兰迪卡其
  '#B8A1C9', // 莫兰迪紫
  '#D4B5A0', // 莫兰迪桃
  '#8FA4A4', // 莫兰迪青
  '#C9A9A9', // 莫兰迪红棕
  '#B5C4B1', // 莫兰迪薄荷
  '#D4C4A8', // 莫兰迪米黄
  '#A8B5C4', // 莫兰迪浅蓝
  '#C4B5A0', // 莫兰迪杏色
  '#B8A9C9', // 莫兰迪淡紫
  '#D4A5A5', // 莫兰迪玫瑰
];

const WordBank: React.FC = () => {
  const [data, setData] = useState(storage.getData());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddNotebookOpen, setIsAddNotebookOpen] = useState(false);
  const [isEditNotebookOpen, setIsEditNotebookOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookDescription, setNotebookDescription] = useState('');
  const [notebookTags, setNotebookTags] = useState('');
  const [coverColor, setCoverColor] = useState('#C4A77D');
  const [currentPage, setCurrentPage] = useState(0);
  const [showFlip, setShowFlip] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [notebookWords, setNotebookWords] = useState<WordData[]>([]);
  const [importText, setImportText] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'done'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const lang = data.user.currentLanguage || 'en';
  const wordsPerPage = 5;

  // 搜索笔记本
  const filteredNotebooks = data.notebooks.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 加载笔记本单词
  const loadNotebookWords = () => {
    if (!selectedNotebook) return;
    const allWords = data.words[lang] || [];
    const localWords = LOCAL_WORDS[lang] || [];
    const combined = [...new Map([...allWords, ...localWords].map(w => [w.word, w])).values()];
    setNotebookWords(combined);
  };

  // 解析导入的文本
  const parseImportText = (text: string): { word: string; chinese?: string }[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const result: { word: string; chinese?: string }[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // 支持格式：
      // word:中文释义
      // word - 中文释义
      // word,中文释义
      // 纯单词
      
      if (trimmed.includes(':')) {
        const [word, chinese] = trimmed.split(':').map(s => s.trim());
        if (word) result.push({ word, chinese });
      } else if (trimmed.includes('-')) {
        const parts = trimmed.split('-');
        const word = parts[0].trim();
        const chinese = parts.slice(1).join('-').trim();
        if (word) result.push({ word, chinese });
      } else if (trimmed.includes(',')) {
        const [word, chinese] = trimmed.split(',').map(s => s.trim());
        if (word) result.push({ word, chinese });
      } else {
        result.push({ word: trimmed });
      }
    });
    
    return result;
  };

  // 导入单词到词库
  const handleImportWords = async () => {
    if (!importText.trim()) {
      toast.error('请输入要导入的单词');
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);

    const parsedWords = parseImportText(importText);
    const newWords: WordData[] = [];
    const existingWords = data.words[lang] || [];
    const existingWordSet = new Set(existingWords.map(w => w.word.toLowerCase()));

    for (let i = 0; i < parsedWords.length; i++) {
      const item = parsedWords[i];
      
      // 跳过重复单词
      if (existingWordSet.has(item.word.toLowerCase())) {
        setImportProgress((i + 1) / parsedWords.length * 100);
        continue;
      }

      try {
        // 尝试从API获取单词数据
        let wordData = await fetchWord(item.word, lang);
        
        // 如果API失败或没有中文释义，使用本地数据或用户提供的中文
        if (!wordData) {
          const localWord = LOCAL_WORDS[lang]?.find(w => w.word.toLowerCase() === item.word.toLowerCase());
          if (localWord) {
            wordData = { ...localWord };
          } else {
            wordData = {
              id: `imported-${crypto.randomUUID()}`,
              word: item.word,
              phonetic: '',
              audioUrl: '',
              definitions: [],
              chineseDefinition: item.chinese || '',
              examples: [],
              synonyms: [],
              similarWords: [],
            };
          }
        } else if (item.chinese) {
          wordData.chineseDefinition = item.chinese;
        }

        newWords.push(wordData);
        existingWordSet.add(item.word.toLowerCase());
        
      } catch (error) {
        // 如果获取失败，使用用户提供的数据
        newWords.push({
          id: `imported-${crypto.randomUUID()}`,
          word: item.word,
          phonetic: '',
          audioUrl: '',
          definitions: [],
          chineseDefinition: item.chinese || '',
          examples: [],
          synonyms: [],
          similarWords: [],
        });
      }

      setImportProgress((i + 1) / parsedWords.length * 100);
    }

    // 保存到本地存储
    if (newWords.length > 0) {
      const updatedData = storage.getData();
      updatedData.words[lang] = [...(updatedData.words[lang] || []), ...newWords];
      
      // 更新所有笔记本的单词计数
      updatedData.notebooks.forEach(notebook => {
        notebook.wordCount = updatedData.words[lang].length;
        notebook.lastModified = new Date().toISOString();
      });
      
      storage.saveData(updatedData);
      setData(updatedData);
      
      toast.success(`成功导入 ${newWords.length} 个单词`);
    } else {
      toast.info('没有新单词需要导入（可能已全部存在）');
    }

    setImportStatus('done');
    setImportText('');
    setIsImportDialogOpen(false);

    setTimeout(() => {
      setImportProgress(0);
      setImportStatus('idle');
    }, 2000);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const handleAddNotebook = () => {
    if (!notebookTitle.trim()) {
      toast.error('请输入笔记本名称');
      return;
    }

    const tagsArray = notebookTags.split(',').map(t => t.trim()).filter(Boolean);
    
    storage.addNotebook({
      title: notebookTitle,
      coverColor,
      description: notebookDescription,
      tags: tagsArray,
    });

    setData(storage.getData());
    setNotebookTitle('');
    setNotebookDescription('');
    setNotebookTags('');
    setCoverColor('#C4A77D');
    setIsAddNotebookOpen(false);
    toast.success('笔记本创建成功');
  };

  const handleEditNotebook = () => {
    if (!selectedNotebook) return;

    const tagsArray = notebookTags.split(',').map(t => t.trim()).filter(Boolean);
    
    storage.updateNotebook(selectedNotebook.id, {
      title: notebookTitle,
      coverColor,
      description: notebookDescription,
      tags: tagsArray,
    });

    setData(storage.getData());
    setIsEditNotebookOpen(false);
    toast.success('笔记本更新成功');
  };

  const handleDeleteNotebook = (notebookId: string) => {
    if (data.notebooks.length <= 1) {
      toast.error('至少需要保留一本笔记本');
      return;
    }

    storage.deleteNotebook(notebookId);
    setData(storage.getData());
    if (selectedNotebook?.id === notebookId) {
      setSelectedNotebook(null);
    }
    toast.success('笔记本已删除');
  };

  const handleOpenNotebook = (notebook: Notebook) => {
    setSelectedNotebook(notebook);
    setCurrentPage(0);
    loadNotebookWords();
  };

  const handleCloseNotebook = () => {
    setSelectedNotebook(null);
    setCurrentPage(0);
    setNotebookWords([]);
  };

  const handlePageChange = (direction: 'left' | 'right') => {
    const totalPages = Math.max(1, Math.ceil(notebookWords.length / wordsPerPage));
    
    if (direction === 'right' && currentPage < totalPages - 1) {
      setFlipDirection('right');
      setShowFlip(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setShowFlip(false);
      }, 300);
    } else if (direction === 'left' && currentPage > 0) {
      setFlipDirection('left');
      setShowFlip(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setShowFlip(false);
      }, 300);
    }
  };

  const currentWords = notebookWords.slice(currentPage * wordsPerPage, (currentPage + 1) * wordsPerPage);
  const totalPages = Math.max(1, Math.ceil(notebookWords.length / wordsPerPage));

  // 如果选中了笔记本，显示翻页阅读界面
  if (selectedNotebook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleCloseNotebook} className="gap-2">
              <ChevronLeft className="h-5 w-5" />
              返回书架
            </Button>
            <h1 className="text-lg font-serif font-bold">{selectedNotebook.title}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setNotebookTitle(selectedNotebook.title);
                setNotebookDescription(selectedNotebook.description);
                setNotebookTags(selectedNotebook.tags.join(','));
                setCoverColor(selectedNotebook.coverColor);
                setIsEditNotebookOpen(true);
              }}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* 书本主体 */}
        <main className="p-6 pb-32">
          <Card className="relative mx-auto max-w-lg rounded-[2rem] shadow-2xl overflow-hidden" style={{ backgroundColor: selectedNotebook.coverColor }}>
            {/* 书脊 */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 to-transparent" />
            
            {/* 封面装饰 */}
            <div className="p-6 text-white">
              <h2 className="text-2xl font-serif font-bold mb-2">{selectedNotebook.title}</h2>
              {selectedNotebook.description && (
                <p className="text-white/80 text-sm">{selectedNotebook.description}</p>
              )}
              {selectedNotebook.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedNotebook.tags.map((tag, i) => (
                    <Badge key={i} className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 书页 */}
            <div className="bg-gradient-to-b from-stone-50 to-amber-50">
              {/* 翻页区域 */}
              <div className="relative">
                {/* 左侧翻页按钮 */}
                <button
                  onClick={() => handlePageChange('left')}
                  disabled={currentPage === 0}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all hover:scale-110 ${
                    currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* 页面内容 */}
                <div className={`p-6 min-h-[400px] transition-all duration-300 ${showFlip ? 'opacity-0' : 'opacity-100'} ${flipDirection === 'left' ? 'translate-x-4' : flipDirection === 'right' ? '-translate-x-4' : 'translate-x-0'}`}>
                  {/* 页面顶部装饰 */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>

                  {/* 页码 */}
                  <div className="text-right text-xs text-muted-foreground mb-4">
                    第 {currentPage + 1} / {totalPages} 页
                  </div>

                  {/* 单词列表 */}
                  {currentWords.length > 0 ? (
                    <div className="space-y-4">
                      {currentWords.map((word, index) => (
                        <div 
                          key={word.id}
                          className={`p-4 rounded-xl bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80 ${index < currentWords.length - 1 ? 'border-b border-dashed border-stone-200' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-serif font-bold text-stone-800">{word.word}</h3>
                              <p className="text-xs text-muted-foreground">{word.phonetic}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">
                              {word.chineseDefinition ? '✓' : 'New'}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-700">{word.chineseDefinition || word.definitions[0] || "暂无释义"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="h-10 w-10 text-stone-400" />
                      </div>
                      <p className="text-stone-700 font-serif">这本笔记本还是空白的</p>
                      <p className="text-xs text-stone-500/60 mt-2">开始添加你的第一个单词吧</p>
                    </div>
                  )}
                </div>

                {/* 右侧翻页按钮 */}
                <button
                  onClick={() => handlePageChange('right')}
                  disabled={currentPage >= totalPages - 1}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all hover:scale-110 ${
                    currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* 底部页码指示器 */}
              <div className="px-6 pb-4">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentPage ? 'bg-stone-600 w-6' : 'bg-stone-300 hover:bg-stone-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // 书架界面
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-100">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-stone-700" />
            <h1 className="text-xl font-serif font-bold text-stone-800">我的书架</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* 导入单词按钮 */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
                  <Upload className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>导入单词书</DialogTitle>
                  <DialogDescription>
                    支持多种格式：单词:释义、单词-释义、单词,释义 或纯单词
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* 文件上传 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">上传文件</label>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText className="h-4 w-4" />
                      选择 .txt 或 .csv 文件
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </div>
                  
                  {/* 手动输入 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">或手动输入</label>
                    <textarea
                      className="w-full h-32 p-3 rounded-lg border border-input bg-background resize-none"
                      placeholder="apple:苹果&#10;banana-香蕉&#10;orange,橙子&#10;grape"
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                    />
                  </div>

                  {/* 导入进度 */}
                  {importStatus === 'importing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>正在导入...</span>
                        <span>{Math.round(importProgress)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleImportWords} 
                    disabled={!importText.trim() || importStatus === 'importing'}
                  >
                    {importStatus === 'importing' ? '导入中...' : '导入单词'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 创建笔记本按钮 */}
            <Dialog open={isAddNotebookOpen} onOpenChange={setIsAddNotebookOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full shadow-lg bg-accent hover:bg-accent/90">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>创建新笔记本</DialogTitle>
                  <DialogDescription>设计你自己的词汇笔记本</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">笔记本名称</label>
                    <Input 
                      placeholder="例如：托福词汇" 
                      value={notebookTitle}
                      onChange={(e) => setNotebookTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">描述</label>
                    <Input 
                      placeholder="简单描述一下这个笔记本" 
                      value={notebookDescription}
                      onChange={(e) => setNotebookDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">标签（用逗号分隔）</label>
                    <Input 
                      placeholder="英语, 学习, 考试" 
                      value={notebookTags}
                      onChange={(e) => setNotebookTags(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">封面颜色（莫兰迪色系）</label>
                    <div className="grid grid-cols-9 gap-2">
                      {MORANDI_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCoverColor(color)}
                          className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${
                            coverColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddNotebook} disabled={!notebookTitle.trim()}>
                    创建笔记本
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10 h-11 rounded-xl bg-secondary/30 border-none"
            placeholder="搜索笔记本..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* 书架 */}
      <main className="p-6 pb-32">
        {/* 书架背景 */}
        <div className="relative">
          {/* 书架层 */}
          <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-b from-stone-700 to-stone-800 rounded-b-lg" />
          
          {/* 笔记本网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredNotebooks.map((notebook, index) => (
              <div
                key={notebook.id}
                className="relative group cursor-pointer"
                onClick={() => handleOpenNotebook(notebook)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 书本卡片 */}
                <Card 
                  className="relative overflow-hidden transition-all hover:scale-105 hover:-translate-y-2"
                  style={{ 
                    backgroundColor: notebook.coverColor,
                    aspectRatio: '3/4',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.3), -2px 0 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* 书脊 */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
                  
                  {/* 封面内容 */}
                  <div className="p-4 h-full flex flex-col text-white">
                    <h3 className="font-serif font-bold text-lg mb-1 truncate">{notebook.title}</h3>
                    {notebook.description && (
                      <p className="text-xs text-white/70 mb-3 line-clamp-2">{notebook.description}</p>
                    )}
                    {notebook.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {notebook.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} className="bg-white/20 text-white text-[10px] border-white/30">
                            {tag}
                          </Badge>
                        ))}
                        {notebook.tags.length > 3 && (
                          <Badge className="bg-white/20 text-white text-[10px] border-white/30">
                            +{notebook.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="mt-2 text-[10px] text-white/50">
                      {notebook.wordCount} 个单词
                    </div>
                  </div>

                  {/* 悬停操作按钮 */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotebookTitle(notebook.title);
                        setNotebookDescription(notebook.description);
                        setNotebookTags(notebook.tags.join(','));
                        setCoverColor(notebook.coverColor);
                        setSelectedNotebook(notebook);
                        setIsEditNotebookOpen(true);
                      }}
                      className="w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotebook(notebook.id);
                      }}
                      className="w-7 h-7 rounded-full bg-red-500/90 shadow-md flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredNotebooks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-stone-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-700 mb-2">书架是空的</h3>
              <p className="text-stone-500 mb-6">创建你的第一本笔记本开始学习吧</p>
              <Button onClick={() => setIsAddNotebookOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                创建笔记本
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WordBank;
