"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_controller_1 = __importDefault(require("../controllers/admin/Admin.controller"));
class AdminRouter extends Admin_controller_1.default {
    constructor() {
        super();
        this.routerAdmin = (0, express_1.Router)();
    }
    rotas_Admin() {
        this.routerAdmin.post("/criar_admin", super.criar_admin);
    }
}
exports.default = AdminRouter;
