"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyVerseService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const BIBLE_DATA_PATH = path.join(__dirname, 'data', 'bible-kjv-1961.json');
let _versePool = null;
function getVersePool() {
    if (!_versePool) {
        const raw = fs.readFileSync(BIBLE_DATA_PATH, 'utf-8');
        _versePool = JSON.parse(raw);
    }
    return _versePool;
}
let DailyVerseService = class DailyVerseService {
    getTodayVerse() {
        const todayKST = (0, dayjs_1.default)().tz('Asia/Seoul').format('YYYY-MM-DD');
        const pool = getVersePool();
        const dayOfYear = (0, dayjs_1.default)(todayKST).diff((0, dayjs_1.default)(todayKST).startOf('year'), 'day');
        const verseIndex = dayOfYear % pool.length;
        const verse = pool[verseIndex];
        return {
            date: todayKST,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
            charCount: verse.text.replace(/\s/g, '').length,
            verseRef: `${verse.book} ${verse.chapter}장 ${verse.verse}절`,
        };
    }
    getVerseByIndex(index) {
        const pool = getVersePool();
        let safeIndex = index;
        if (isNaN(safeIndex) || safeIndex < 0)
            safeIndex = 0;
        if (safeIndex >= pool.length)
            safeIndex = pool.length - 1;
        const verse = pool[safeIndex];
        return {
            index: safeIndex,
            total: pool.length,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
            charCount: verse.text.replace(/\s/g, '').length,
            verseRef: `${verse.book} ${verse.chapter}장 ${verse.verse}절`,
        };
    }
};
exports.DailyVerseService = DailyVerseService;
exports.DailyVerseService = DailyVerseService = __decorate([
    (0, common_1.Injectable)()
], DailyVerseService);
//# sourceMappingURL=daily-verse.service.js.map