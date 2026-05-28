export declare class DailyVerseService {
    getTodayVerse(offset?: number): {
        date: string;
        book: string;
        chapter: number;
        verse: number;
        text: string;
        charCount: number;
        verseRef: string;
    };
    getVerseByIndex(index: number): {
        index: number;
        total: number;
        book: string;
        chapter: number;
        verse: number;
        text: string;
        charCount: number;
        verseRef: string;
    };
}
