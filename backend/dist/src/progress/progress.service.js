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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgress(userKey) {
        const user = await this.prisma.user.findUnique({ where: { userKey } });
        if (!user) {
            return { sequentialIndex: 0, completedDates: [], randomOffset: 0, totalPoints: 0, pointHistory: [] };
        }
        return {
            sequentialIndex: user.sequentialIndex,
            completedDates: this.parseJson(user.completedDates, []),
            randomOffset: user.randomOffset,
            totalPoints: user.totalPoints,
            pointHistory: this.parseJson(user.pointHistory, []),
        };
    }
    async saveProgress(userKey, data) {
        const user = await this.prisma.user.upsert({
            where: { userKey },
            create: {
                userKey,
                sequentialIndex: data.sequentialIndex ?? 0,
                completedDates: JSON.stringify(data.completedDates ?? []),
                randomOffset: data.randomOffset ?? 0,
                totalPoints: data.totalPoints ?? 0,
                pointHistory: JSON.stringify(data.pointHistory ?? []),
            },
            update: {
                ...(data.sequentialIndex !== undefined && { sequentialIndex: data.sequentialIndex }),
                ...(data.completedDates !== undefined && { completedDates: JSON.stringify(data.completedDates) }),
                ...(data.randomOffset !== undefined && { randomOffset: data.randomOffset }),
                ...(data.totalPoints !== undefined && { totalPoints: data.totalPoints }),
                ...(data.pointHistory !== undefined && { pointHistory: JSON.stringify(data.pointHistory) }),
            },
        });
        return {
            sequentialIndex: user.sequentialIndex,
            completedDates: this.parseJson(user.completedDates, []),
            randomOffset: user.randomOffset,
            totalPoints: user.totalPoints,
            pointHistory: this.parseJson(user.pointHistory, []),
        };
    }
    parseJson(raw, fallback) {
        try {
            return JSON.parse(raw);
        }
        catch {
            return fallback;
        }
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map