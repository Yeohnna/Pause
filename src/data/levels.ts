import { WordData } from "@/types/types";

export const LEVEL_WORDS: Record<string, string[]> = {
  primary: ['apple', 'banana', 'cat', 'dog', 'elephant', 'family', 'garden', 'happy', 'island', 'juice'],
  middle: ['adventure', 'beautiful', 'climate', 'distance', 'education', 'fabulous', 'grateful', 'history', 'imagine', 'journey'],
  high: ['abandon', 'beneficial', 'capacity', 'determine', 'efficient', 'frequent', 'guarantee', 'hesitate', 'indicate', 'justice'],
  university: ['abstract', 'benevolent', 'comprehensive', 'differentiate', 'eloquent', 'facilitate', 'generalize', 'hypothetical', 'innovative', 'judicious'],
  advanced: ['abnegation', 'bellicose', 'cacophony', 'didactic', 'euphemism', 'fastidious', 'garrulous', 'histrionic', 'iconoclast', 'juxtaposition'],
};

export const LEVEL_LABELS: Record<string, string> = {
  primary: '小学词汇',
  middle: '初中词汇',
  high: '高中词汇',
  university: '大学词汇',
  advanced: '专业/进阶词汇',
};
