"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_validation_1 = require("./../../validation/admin.validation");
class Admin {
    criar_admin(req, res) {
        const { nome, email, palavra_passe, telefone, data_nascimento } = req.body;
        admin_validation_1.SchemaAdmin.parseAsync({
            nome: nome,
            email: email,
            palavra_passe: palavra_passe,
            telefone: telefone,
            data_nascimento: new Date(data_nascimento)
        }).then((sucesso_validacacao) => __awaiter(this, void 0, void 0, function* () {
            yield ;
        })).catch((err) => {
            res.status(400).json(err);
        });
    }
}
exports.default = Admin;
