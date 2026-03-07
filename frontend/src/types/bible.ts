export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface DailyVerse {
  date: string; // YYYY-MM-DD
  book: string;
  chapter: number;
  verse: number;
  text: string;
}
