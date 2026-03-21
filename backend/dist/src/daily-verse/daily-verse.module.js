"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyVerseModule = void 0;
const common_1 = require("@nestjs/common");
const daily_verse_controller_1 = require("./daily-verse.controller");
const daily_verse_service_1 = require("./daily-verse.service");
let DailyVerseModule = class DailyVerseModule {
};
exports.DailyVerseModule = DailyVerseModule;
exports.DailyVerseModule = DailyVerseModule = __decorate([
    (0, common_1.Module)({
        controllers: [daily_verse_controller_1.DailyVerseController],
        providers: [daily_verse_service_1.DailyVerseService],
        exports: [daily_verse_service_1.DailyVerseService],
    })
], DailyVerseModule);
//# sourceMappingURL=daily-verse.module.js.map