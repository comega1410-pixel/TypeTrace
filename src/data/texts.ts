export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  category: 'mindfulness' | 'craft' | 'perseverance' | 'calm';
}

export const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'calm', 'flow', 'peace', 'focus', 'gentle', 'steady', 'breath', 'mind', 'hands', 'quiet'
];

export const CALM_QUOTES: QuoteItem[] = [
  {
    id: 'q1',
    quote: 'Practice calmly. Build confidence. Get faster over time.',
    author: 'TypeTrack Philosophy',
    category: 'mindfulness'
  },
  {
    id: 'q2',
    quote: 'Nature does not hurry, yet everything is accomplished.',
    author: 'Lao Tzu',
    category: 'calm'
  },
  {
    id: 'q3',
    quote: 'Slow down and everything you are chasing will come around and catch you.',
    author: 'John De Paola',
    category: 'mindfulness'
  },
  {
    id: 'q4',
    quote: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    author: 'John Maeda',
    category: 'craft'
  },
  {
    id: 'q5',
    quote: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.',
    author: 'John C. Maxwell',
    category: 'perseverance'
  },
  {
    id: 'q6',
    quote: 'Touch typing is not about speed; speed is merely the natural result of calmness and precision.',
    author: 'Typing Coach',
    category: 'craft'
  },
  {
    id: 'q7',
    quote: 'The secret of getting ahead is getting started with a single gentle step.',
    author: 'Mark Twain',
    category: 'perseverance'
  },
  {
    id: 'q8',
    quote: 'In the middle of difficulty lies quiet opportunity.',
    author: 'Albert Einstein',
    category: 'calm'
  },
  {
    id: 'q9',
    quote: 'Let your hands relax. Trust that your fingers already know the way home.',
    author: 'Mindful Practice',
    category: 'mindfulness'
  }
];

export function generateRandomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    words.push(COMMON_WORDS[randomIndex]);
  }
  return words.join(' ');
}
