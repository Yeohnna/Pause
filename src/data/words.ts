import { WordData } from '@/types/types';

export const LOCAL_WORDS: Record<string, WordData[]> = {
  en: [
    {
      id: 'local-apple',
      word: 'apple',
      phonetic: '/ˈæpl/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3',
      definitions: ['A fruit that grows on trees, typically round and red or green.', 'The tree that bears apples.'],
      chineseDefinition: '苹果',
      examples: ['I eat an apple every day.', 'The apple tree is full of fruit.'],
      synonyms: [{ word: 'fruit', chinese: '水果' }, { word: 'pome', chinese: '梨果' }],
      similarWords: [{ word: 'apply', note: '拼写相似', chinese: '应用' }, { word: 'pineapple', note: '包含 apple', chinese: '菠萝' }]
    },
    {
      id: 'local-banana',
      word: 'banana',
      phonetic: '/bəˈnænə/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/banana-us.mp3',
      definitions: ['A long curved fruit with a yellow skin.', 'The tropical plant that bears bananas.'],
      chineseDefinition: '香蕉',
      examples: ['Bananas are a good source of potassium.', 'She peeled a banana for breakfast.'],
      synonyms: [{ word: 'fruit', chinese: '水果' }, { word: 'plantain', chinese: '芭蕉' }],
      similarWords: [{ word: 'bandana', note: '发音相似', chinese: '头巾' }]
    },
    {
      id: 'local-cat',
      word: 'cat',
      phonetic: '/kæt/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/cat-us.mp3',
      definitions: ['A small domesticated carnivorous mammal with soft fur.', 'Any member of the cat family.'],
      chineseDefinition: '猫',
      examples: ['The cat is sleeping on the couch.', 'She has two cats.'],
      synonyms: [{ word: 'feline', chinese: '猫科动物' }, { word: 'kitty', chinese: '小猫' }],
      similarWords: [{ word: 'cap', note: '发音相似', chinese: '帽子' }, { word: 'cut', note: '发音相似', chinese: '切' }]
    },
    {
      id: 'local-dog',
      word: 'dog',
      phonetic: '/dɒɡ/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/dog-us.mp3',
      definitions: ['A domesticated carnivorous mammal that typically has a long snout.', 'A person who is unpleasant or contemptible.'],
      chineseDefinition: '狗',
      examples: ['The dog barked at the stranger.', 'He is a lucky dog.'],
      synonyms: [{ word: 'canine', chinese: '犬科动物' }, { word: 'pooch', chinese: '小狗' }],
      similarWords: [{ word: 'dot', note: '发音相似', chinese: '点' }, { word: 'log', note: '发音相似', chinese: '日志' }]
    },
    {
      id: 'local-elephant',
      word: 'elephant',
      phonetic: '/ˈelɪfənt/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/elephant-us.mp3',
      definitions: ['A very large animal with a long trunk and tusks.', 'Something that is very large or impressive.'],
      chineseDefinition: '大象',
      examples: ['Elephants have excellent memories.', 'The elephant is the largest land animal.'],
      synonyms: [{ word: 'pachyderm', chinese: '厚皮动物' }],
      similarWords: [{ word: 'elevate', note: '拼写相似', chinese: '提升' }]
    },
    {
      id: 'local-family',
      word: 'family',
      phonetic: '/ˈfæməli/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/family-us.mp3',
      definitions: ['A group consisting of parents and children living together.', 'All the descendants of a common ancestor.'],
      chineseDefinition: '家庭',
      examples: ['I spent the weekend with my family.', 'Family is very important to me.'],
      synonyms: [{ word: 'household', chinese: '家庭' }, { word: 'kin', chinese: '亲属' }],
      similarWords: [{ word: 'familiar', note: '拼写相似', chinese: '熟悉的' }, { word: 'fame', note: '发音相似', chinese: '名声' }]
    },
    {
      id: 'local-garden',
      word: 'garden',
      phonetic: '/ˈɡɑːdn/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/garden-us.mp3',
      definitions: ['A piece of ground used to grow flowers, fruit, or vegetables.', 'To work in a garden.'],
      chineseDefinition: '花园',
      examples: ['She planted roses in her garden.', 'I love to garden on weekends.'],
      synonyms: [{ word: 'yard', chinese: '院子' }, { word: 'plot', chinese: '小块土地' }],
      similarWords: [{ word: 'guardian', note: '拼写相似', chinese: '守护者' }, { word: 'garland', note: '发音相似', chinese: '花环' }]
    },
    {
      id: 'local-happy',
      word: 'happy',
      phonetic: '/ˈhæpi/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/happy-us.mp3',
      definitions: ['Feeling or showing pleasure or contentment.', 'Fortunate or convenient.'],
      chineseDefinition: '快乐的',
      examples: ['She looks very happy today.', 'Happy birthday!'],
      synonyms: [{ word: 'joyful', chinese: '快乐的' }, { word: 'cheerful', chinese: '愉快的' }],
      similarWords: [{ word: 'happen', note: '拼写相似', chinese: '发生' }, { word: 'harry', note: '发音相似', chinese: '骚扰' }]
    },
    {
      id: 'local-island',
      word: 'island',
      phonetic: '/ˈaɪlənd/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/island-us.mp3',
      definitions: ['A piece of land surrounded by water.', 'An isolated group or area.'],
      chineseDefinition: '岛屿',
      examples: ['We spent our vacation on a tropical island.', 'The island is only accessible by boat.'],
      synonyms: [{ word: 'isle', chinese: '小岛' }, { word: 'atoll', chinese: '环礁' }],
      similarWords: [{ word: 'isolate', note: '拼写相似', chinese: '隔离' }, { word: 'Iceland', note: '发音相似', chinese: '冰岛' }]
    },
    {
      id: 'local-juice',
      word: 'juice',
      phonetic: '/dʒuːs/',
      audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/juice-us.mp3',
      definitions: ['The liquid part of fruit or vegetables.', 'Energy or vitality.'],
      chineseDefinition: '果汁',
      examples: ['I drink orange juice every morning.', 'The juice of the grape is very sweet.'],
      synonyms: [{ word: 'nectar', chinese: '花蜜' }, { word: 'extract', chinese: '提取物' }],
      similarWords: [{ word: 'juicy', note: '拼写相似', chinese: '多汁的' }, { word: 'choose', note: '发音相似', chinese: '选择' }]
    },
    {
      id: 'local-adventure',
      word: 'adventure',
      phonetic: '/ədˈventʃər/',
      audioUrl: '',
      definitions: ['An unusual and exciting or daring experience.', 'The activity of going on adventures.'],
      chineseDefinition: '冒险',
      examples: ['Life is an adventure.', 'They went on a great adventure.'],
      synonyms: [{ word: 'expedition', chinese: '探险' }, { word: 'quest', chinese: '探索' }],
      similarWords: [{ word: 'adventurous', note: '拼写相似', chinese: '冒险的' }]
    },
    {
      id: 'local-beautiful',
      word: 'beautiful',
      phonetic: '/ˈbjuːtɪfl/',
      audioUrl: '',
      definitions: ['Pleasing to the senses or mind.', 'Having qualities that give great pleasure.'],
      chineseDefinition: '美丽的',
      examples: ['What a beautiful sunset!', 'She is a beautiful woman.'],
      synonyms: [{ word: 'gorgeous', chinese: '华丽的' }, { word: 'lovely', chinese: '可爱的' }],
      similarWords: [{ word: 'beauty', note: '拼写相似', chinese: '美丽' }]
    },
    {
      id: 'local-climate',
      word: 'climate',
      phonetic: '/ˈklaɪmət/',
      audioUrl: '',
      definitions: ['The weather conditions prevailing in an area.', 'The prevailing trend of public opinion.'],
      chineseDefinition: '气候',
      examples: ['The climate is getting warmer.', 'The political climate has changed.'],
      synonyms: [{ word: 'weather', chinese: '天气' }, { word: 'atmosphere', chinese: '氛围' }],
      similarWords: [{ word: 'climax', note: '发音相似', chinese: '高潮' }, { word: 'climatic', note: '拼写相似', chinese: '气候的' }]
    },
    {
      id: 'local-distance',
      word: 'distance',
      phonetic: '/ˈdɪstəns/',
      audioUrl: '',
      definitions: ['An amount of space between two things.', 'The quality of being far away.'],
      chineseDefinition: '距离',
      examples: ['The distance between the two cities is 100 km.', 'Distance makes the heart grow fonder.'],
      synonyms: [{ word: 'space', chinese: '空间' }, { word: 'gap', chinese: '间隙' }],
      similarWords: [{ word: 'distaste', note: '拼写相似', chinese: '厌恶' }, { word: 'distinct', note: '拼写相似', chinese: '明显的' }]
    },
    {
      id: 'local-education',
      word: 'education',
      phonetic: '/ˌedʒuˈkeɪʃn/',
      audioUrl: '',
      definitions: ['The process of receiving or giving systematic instruction.', 'An academic qualification.'],
      chineseDefinition: '教育',
      examples: ['Education is the key to success.', 'She has a good education.'],
      synonyms: [{ word: 'learning', chinese: '学习' }, { word: 'schooling', chinese: '学校教育' }],
      similarWords: [{ word: 'educate', note: '拼写相似', chinese: '教育' }, { word: 'educator', note: '拼写相似', chinese: '教育家' }]
    },
    {
      id: 'local-abandon',
      word: 'abandon',
      phonetic: '/əˈbændən/',
      audioUrl: '',
      definitions: ['Give up completely.', 'Leave behind.'],
      chineseDefinition: '放弃',
      examples: ['They had to abandon the project.', 'She abandoned her dreams.'],
      synonyms: [{ word: 'desert', chinese: '抛弃' }, { word: 'quit', chinese: '退出' }],
      similarWords: [{ word: 'abundant', note: '拼写相似', chinese: '丰富的' }]
    },
    {
      id: 'local-beneficial',
      word: 'beneficial',
      phonetic: '/ˌbenɪˈfɪʃl/',
      audioUrl: '',
      definitions: ['Resulting in good; favorable or advantageous.', 'Helpful or useful.'],
      chineseDefinition: '有益的',
      examples: ['Exercise is beneficial to health.', 'This will be beneficial for everyone.'],
      synonyms: [{ word: 'advantageous', chinese: '有利的' }, { word: 'helpful', chinese: '有帮助的' }],
      similarWords: [{ word: 'benefit', note: '拼写相似', chinese: '利益' }, { word: 'benevolent', note: '拼写相似', chinese: '仁慈的' }]
    },
    {
      id: 'local-abstract',
      word: 'abstract',
      phonetic: '/ˈæbstrækt/',
      audioUrl: '',
      definitions: ['Existing in thought or as an idea but not having physical or concrete existence.', 'A summary of the contents of a book.'],
      chineseDefinition: '抽象的',
      examples: ['Love is an abstract concept.', 'Please read the abstract first.'],
      synonyms: [{ word: 'theoretical', chinese: '理论的' }, { word: 'conceptual', chinese: '概念的' }],
      similarWords: [{ word: 'absract', note: '拼写相似', chinese: '拼写错误' }, { word: 'abstraction', note: '拼写相似', chinese: '抽象' }]
    },
    {
      id: 'local-abnegation',
      word: 'abnegation',
      phonetic: '/ˌæbnɪˈɡeɪʃn/',
      audioUrl: '',
      definitions: ['The action of renouncing or rejecting something.', 'Self-denial.'],
      chineseDefinition: '放弃；克制',
      examples: ['His abnegation of wealth impressed everyone.', 'She practiced abnegation for spiritual reasons.'],
      synonyms: [{ word: 'renunciation', chinese: '放弃' }, { word: 'self-denial', chinese: '自我否定' }],
      similarWords: [{ word: 'abnegate', note: '拼写相似', chinese: '放弃' }]
    },
    {
      id: 'local-hello',
      word: 'hello',
      phonetic: '/həˈloʊ/',
      audioUrl: '',
      definitions: ['Used as a greeting or to begin a telephone conversation.', 'An expression of surprise.'],
      chineseDefinition: '你好',
      examples: ['Hello, how are you?', 'Hello! What a surprise!'],
      synonyms: [{ word: 'hi', chinese: '嗨' }, { word: 'greeting', chinese: '问候' }],
      similarWords: [{ word: 'hallo', note: '拼写相似', chinese: '你好' }, { word: 'hell', note: '发音相似', chinese: '地狱' }]
    },
    {
      id: 'local-world',
      word: 'world',
      phonetic: '/wɜːrld/',
      audioUrl: '',
      definitions: ['The earth, together with all its countries, peoples, and natural features.', 'A particular group or sphere of activity.'],
      chineseDefinition: '世界',
      examples: ['The world is a beautiful place.', 'He is famous around the world.'],
      synonyms: [{ word: 'globe', chinese: '地球' }, { word: 'earth', chinese: '地球' }],
      similarWords: [{ word: 'word', note: '发音相似', chinese: '单词' }, { word: 'worls', note: '拼写相似', chinese: '拼写错误' }]
    },
    {
      id: 'local-language',
      word: 'language',
      phonetic: '/ˈlæŋɡwɪdʒ/',
      audioUrl: '',
      definitions: ['The method of human communication.', 'A system of communication used by a particular country or community.'],
      chineseDefinition: '语言',
      examples: ['English is a global language.', 'She speaks three languages.'],
      synonyms: [{ word: 'tongue', chinese: '语言' }, { word: 'dialect', chinese: '方言' }],
      similarWords: [{ word: 'languish', note: '拼写相似', chinese: '衰弱' }, { word: 'linguage', note: '拼写相似', chinese: '语言学' }]
    },
    {
      id: 'local-pause',
      word: 'pause',
      phonetic: '/pɔːz/',
      audioUrl: '',
      definitions: ['A temporary stop in action or speech.', 'To stop temporarily.'],
      chineseDefinition: '暂停',
      examples: ['Please pause for a moment.', 'There was a pause in the conversation.'],
      synonyms: [{ word: 'break', chinese: '休息' }, { word: 'intermission', chinese: '中断' }],
      similarWords: [{ word: 'paws', note: '发音相似', chinese: '爪子' }, { word: 'pose', note: '发音相似', chinese: '姿势' }]
    },
    {
      id: 'local-learn',
      word: 'learn',
      phonetic: '/lɜːrn/',
      audioUrl: '',
      definitions: ['Gain or acquire knowledge of or skill in.', 'Study or be taught.'],
      chineseDefinition: '学习',
      examples: ['We never stop learning.', 'She wants to learn English.'],
      synonyms: [{ word: 'study', chinese: '学习' }, { word: 'acquire', chinese: '获得' }],
      similarWords: [{ word: 'learnt', note: '拼写相似', chinese: '学习（过去式）' }, { word: 'lean', note: '发音相似', chinese: '倾斜' }]
    }
  ]
};

export const getLocalWord = (word: string, lang: string = 'en'): WordData | undefined => {
  return LOCAL_WORDS[lang]?.find(w => w.word.toLowerCase() === word.toLowerCase());
};
