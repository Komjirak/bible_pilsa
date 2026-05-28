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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const prisma_service_1 = require("../prisma/prisma.service");
const rxjs_1 = require("rxjs");
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AuthService = class AuthService {
    httpService;
    prisma;
    jwtService;
    httpsAgent;
    constructor(httpService, prisma, jwtService) {
        this.httpService = httpService;
        this.prisma = prisma;
        this.jwtService = jwtService;
        const certPath = process.env.TOSS_CERT_PATH || path.join(process.cwd(), 'certs', 'client.crt');
        const keyPath = process.env.TOSS_KEY_PATH || path.join(process.cwd(), 'certs', 'client.key');
        try {
            if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
                this.httpsAgent = new https.Agent({
                    cert: fs.readFileSync(certPath),
                    key: fs.readFileSync(keyPath),
                });
            }
        }
        catch (e) {
            console.error('[auth] mTLS 인증서 로드 실패:', e);
        }
    }
    async exchangeToken(authorizationCode, referrer) {
        if (process.env.NODE_ENV !== 'production' && authorizationCode.startsWith('mock-')) {
            const userKey = `dev-user-mock`;
            return this.upsertAndSign(userKey);
        }
        try {
            const tokenRes = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', { authorizationCode, referrer }, { httpsAgent: this.httpsAgent, timeout: 5000 }));
            const tossAccessToken = tokenRes.data?.success?.accessToken ?? tokenRes.data?.accessToken;
            if (!tossAccessToken) {
                throw new Error('Toss 토큰 발급 실패: ' + JSON.stringify(tokenRes.data));
            }
            const meRes = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me', {
                headers: { Authorization: `Bearer ${tossAccessToken}` },
                httpsAgent: this.httpsAgent,
                timeout: 5000,
            }));
            const userKey = (meRes.data?.success?.userKey ?? meRes.data?.userKey)?.toString();
            if (!userKey) {
                throw new Error('userKey 조회 실패: ' + JSON.stringify(meRes.data));
            }
            return this.upsertAndSign(userKey);
        }
        catch (err) {
            console.error('[auth] Toss 인증 실패:', err?.response?.data || err?.message);
            if (!this.httpsAgent) {
                const fallbackKey = `dev-user-${authorizationCode.slice(0, 8)}`;
                return this.upsertAndSign(fallbackKey);
            }
            throw new common_1.HttpException('인증에 실패했습니다.', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async upsertAndSign(userKey) {
        await this.prisma.user.upsert({
            where: { userKey },
            create: { userKey },
            update: {},
        });
        const token = this.jwtService.sign({ userKey, sub: userKey });
        return { token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map