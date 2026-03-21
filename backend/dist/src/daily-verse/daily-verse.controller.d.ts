import { DailyVerseService } from './daily-verse.service';
export declare class DailyVerseController {
    private readonly dailyVerseService;
    constructor(dailyVerseService: DailyVerseService);
    getTodayVerse(): {
        date: string;
        book: string;
        chapter: number;
        verse: number;
        text: string;
        charCount: number;
        verseRef: string;
    };
    getVerseByIndex(indexStr: string): {
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
