"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Admin_router_1 = __importDefault(require("../routes/Admin.router"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
class Server {
    constructor() {
        this.express = (0, express_1.default)();
        this.middleware();
        this.todas_rotas();
    }
    todas_rotas() {
        this.express.use("admin/", new Admin_router_1.default().routerAdmin);
    }
    middleware() {
        dotenv_1.default.config();
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use((0, cors_1.default)());
        (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        });
    }
    porta(porta) {
        this.express.listen(porta || process.env.PORTA_SERVIDOR, () => {
            console.log(`Servidor funcionando na porta ${porta || process.env.PORTA_SERVIDOR}`);
        });
    }
}
exports.default = Server;
