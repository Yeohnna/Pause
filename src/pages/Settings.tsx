import React, { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Upload, Trash2, Moon, Sun, Bell, GraduationCap, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { LEVEL_LABELS } from '@/data/levels';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LEARNING_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
];

const Settings: React.FC = () => {
  const [data, setData] = useState(storage.getData());

  const handleLevelChange = (value: string) => {
    const newData = { ...data };
    newData.user.level = value as any;
    storage.saveData(newData);
    setData(newData);
    toast.success(`学习等级已切换为: ${LEVEL_LABELS[value]}`);
  };

  const handleLanguageChange = (value: string) => {
    const newData = { ...data };
    newData.user.currentLanguage = value;
    storage.saveData(newData);
    setData(newData);
    toast.success(`学习语言已切换为: ${LEARNING_LANGUAGES.find(l => l.value === value)?.label}`);
  };
  const handleExport = () => {
    const data = storage.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pause_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('数据导出成功');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        storage.saveData(data);
        toast.success('数据导入成功，请刷新页面');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        toast.error('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">设置</h1>
        <p className="text-muted-foreground text-sm">自定义你的 Pause 体验</p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-primary/70 uppercase tracking-widest">学习设置</h2>
          <Card className="p-4 rounded-2xl border-none shadow-sm space-y-6">
            <div className="space-y-2">
              <Label className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> 学习等级
              </Label>
              <Select value={data.user.level || 'primary'} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-full bg-secondary/50 border-none rounded-xl h-12">
                  <SelectValue placeholder="选择等级" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground italic">切换等级后，首页和学习页将显示对应难度的词汇</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" /> 学习语言
              </Label>
              <Select value={data.user.currentLanguage || 'en'} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full bg-secondary/50 border-none rounded-xl h-12">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">每日提醒</Label>
                <p className="text-xs text-muted-foreground">在设定的时间提醒你该休息一下了</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">深色模式</Label>
                <p className="text-xs text-muted-foreground">让眼睛在深夜也感到舒适</p>
              </div>
              <Switch />
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-primary/70 uppercase tracking-widest">数据管理</h2>
          <Card className="p-4 rounded-2xl border-none shadow-sm space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl justify-start"
              onClick={handleExport}
            >
              <Download className="mr-3 h-5 w-5" /> 导出学习数据
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl justify-start"
                onClick={() => document.getElementById('import-input')?.click()}
              >
                <Upload className="mr-3 h-5 w-5" /> 导入学习数据
              </Button>
              <input 
                id="import-input"
                type="file"
                className="hidden"
                accept=".json"
                onChange={handleImport}
              />
            </div>

            <Button 
              variant="ghost" 
              className="w-full h-12 rounded-xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm('确定要清除所有本地数据吗？此操作不可撤销。')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <Trash2 className="mr-3 h-5 w-5" /> 清除所有数据
            </Button>
          </Card>
        </section>

        <section className="pt-8 text-center space-y-2">
          <p className="text-xs text-muted-foreground">Pause Version 1.0.0</p>
          <p className="text-xs text-muted-foreground font-serif italic">Made with peace and focus.</p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
