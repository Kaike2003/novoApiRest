"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AdminRouter {
    constructor() {
        this.routerAdmin = (0, express_1.Router)();
    }
    rotas_Admin() {
        this.routerAdmin.post("");
    }
}
exports.default = AdminRouter;
