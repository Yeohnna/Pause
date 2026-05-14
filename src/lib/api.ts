import { WordData } from '../types/types';
import { storage } from './storage';
import { getLocalWord } from '../data/words';

/**
 * 核心查词服务：
 * 1. 优先从本地 localStorage 查找
 * 2. 如果没有，从本地数据文件查找
 * 3. 如果还没有，从远程 API 获取 (Free Dictionary + 有道翻译)
 * 4. 获取成功后自动存入本地，实现“查一次，存永久”
 */
export async function getWordData(word: string, lang: string = 'en'): Promise<WordData | null> {
  const data = storage.getData();
  const langWords = data.words[lang] || [];
  
  // 1. 查本地缓存 (localStorage)
  const cachedWord = langWords.find(w => w.word.toLowerCase() === word.toLowerCase());
  // 如果有本地数据且数据比较完整（有释义或翻译），则返回
  if (cachedWord && (cachedWord.chineseDefinition || cachedWord.definitions.length > 0)) {
    return cachedWord;
  }

  // 2. 查本地数据文件（作为远程 API 失败时的备用）
  const localWord = getLocalWord(word, lang);
  if (localWord) {
    // 如果本地数据文件中有，也存入 localStorage
    const newWord: WordData = {
      ...localWord,
      id: cachedWord?.id || localWord.id
    };
    
    const newData = { ...data };
    if (!newData.words[lang]) newData.words[lang] = [];
    
    const index = newData.words[lang].findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (index >= 0) {
      newData.words[lang][index] = newWord;
    } else {
      newData.words[lang].push(newWord);
    }
    storage.saveData(newData);
    
    return newWord;
  }

  try {
    // 3. 查远程 API (Free Dictionary API)
    const dictResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`
    );
    const dictData = dictResponse.ok ? await dictResponse.json() : null;
    
    // 4. 获取中文释义 (有道 Suggest API)
    const transResponse = await fetch(
      `https://dict.youdao.com/suggest?q=${word}&num=1&doctype=json`
    );
    const transData = transResponse.ok ? await transResponse.json() : null;
    const chineseDef = transData?.data?.entries?.[0]?.explain || '';

    if (!dictData && !chineseDef) {
      // 如果远程 API 都失败了，返回一个基本的单词对象
      const fallbackWord: WordData = {
        id: cachedWord?.id || crypto.randomUUID(),
        word: word,
        phonetic: '',
        audioUrl: '',
        definitions: [],
        chineseDefinition: '',
        examples: [],
        synonyms: [],
        similarWords: []
      };
      
      const newData = { ...data };
      if (!newData.words[lang]) newData.words[lang] = [];
      const index = newData.words[lang].findIndex(w => w.word.toLowerCase() === word.toLowerCase());
      if (index >= 0) {
        newData.words[lang][index] = fallbackWord;
      } else {
        newData.words[lang].push(fallbackWord);
      }
      storage.saveData(newData);
      
      return fallbackWord;
    }

    const entry = dictData?.[0] || {};
    const newWord: WordData = {
      id: cachedWord?.id || crypto.randomUUID(),
      word: entry.word || word,
      phonetic: entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || '',
      audioUrl: entry.phonetics?.find((p: any) => p.audio)?.audio || '',
      definitions: entry.meanings?.flatMap((m: any) => 
        m.definitions?.map((d: any) => d.definition)
      ) || [],
      chineseDefinition: chineseDef || (cachedWord?.chineseDefinition || ''),
      examples: entry.meanings?.flatMap((m: any) =>
        m.definitions?.filter((d: any) => d.example).map((d: any) => d.example)
      ) || [],
      synonyms: entry.meanings?.flatMap((m: any) => m.synonyms) || [],
      similarWords: [] 
    };

    // 5. 存入本地缓存
    const newData = { ...data };
    if (!newData.words[lang]) newData.words[lang] = [];
    
    const index = newData.words[lang].findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (index >= 0) {
      newData.words[lang][index] = newWord;
    } else {
      newData.words[lang].push(newWord);
    }
    storage.saveData(newData);

    return newWord;
  } catch (error) {
    console.error('Error fetching word data:', error);
    
    // 网络错误时，返回 fallback 单词对象
    const fallbackWord: WordData = {
      id: cachedWord?.id || crypto.randomUUID(),
      word: word,
      phonetic: '',
      audioUrl: '',
      definitions: [],
      chineseDefinition: '',
      examples: [],
      synonyms: [],
      similarWords: []
    };
    
    const newData = { ...data };
    if (!newData.words[lang]) newData.words[lang] = [];
    const index = newData.words[lang].findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (index >= 0) {
      newData.words[lang][index] = fallbackWord;
    } else {
      newData.words[lang].push(fallbackWord);
    }
    storage.saveData(newData);
    
    return fallbackWord;
  }
}

// 保持向下兼容，但推荐使用 getWordData
export async function fetchWord(word: string, lang: string = 'en'): Promise<WordData | null> {
  return getWordData(word, lang);
}
