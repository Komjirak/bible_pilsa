"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyVerseController = void 0;
const common_1 = require("@nestjs/common");
const daily_verse_service_1 = require("./daily-verse.service");
let DailyVerseController = class DailyVerseController {
    dailyVerseService;
    constructor(dailyVerseService) {
        this.dailyVerseService = dailyVerseService;
    }
    getTodayVerse(offsetStr) {
        const offset = parseInt(offsetStr || '0', 10);
        return this.dailyVerseService.getTodayVerse(offset);
    }
    getVerseByIndex(indexStr) {
        const index = parseInt(indexStr || '0', 10);
        return this.dailyVerseService.getVerseByIndex(index);
    }
};
exports.DailyVerseController = DailyVerseController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyVerseController.prototype, "getTodayVerse", null);
__decorate([
    (0, common_1.Get)('sequential'),
    __param(0, (0, common_1.Query)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyVerseController.prototype, "getVerseByIndex", null);
exports.DailyVerseController = DailyVerseController = __decorate([
    (0, common_1.Controller)('daily-verse'),
    __metadata("design:paramtypes", [daily_verse_service_1.DailyVerseService])
], DailyVerseController);
//# sourceMappingURL=daily-verse.controller.js.map