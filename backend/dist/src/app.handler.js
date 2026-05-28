"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const server = (0, express_1.default)();
const appReady = core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
    logger: false,
}).then((app) => {
    app.enableCors();
    return app.init();
});
const handler = async (req, res) => {
    await appReady;
    server(req, res);
};
exports.handler = handler;
//# sourceMappingURL=app.handler.js.map