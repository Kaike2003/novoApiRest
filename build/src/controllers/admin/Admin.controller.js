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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../prisma/prisma");
const admin_validation_1 = require("./../../validation/admin.validation");
const crypto_1 = __importDefault(require("crypto"));
const PalavraPasse_1 = __importDefault(require("../../service/PalavraPasse"));
class AdminController {
    constructor() {
        this.tamanho_string = 8;
        this.bytesAleatorios = crypto_1.default.randomBytes(this.tamanho_string);
        this.stringAleatoria = this.bytesAleatorios.toString("base64");
    }
    criar_admin(req, res) {
        const { nome, email, palavra_passe, telefone, data_nascimento } = req.body;
        admin_validation_1.SchemaAdmin.parseAsync({
            nome: nome,
            email: email,
            palavra_passe: palavra_passe,
            telefone: telefone,
            data_nascimento: new Date(data_nascimento)
        }).then((sucesso_validacacao) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.utilizador.create({
                data: {
                    nome: sucesso_validacacao.nome,
                    email: sucesso_validacacao.email,
                    palavra_passe: yield new PalavraPasse_1.default().Encriptar(sucesso_validacacao.palavra_passe),
                    telefone: sucesso_validacacao.telefone,
                    data_nascimento: new Date(sucesso_validacacao.data_nascimento),
                    autenticado: false,
                    banido: false,
                    classe: "ADMIN",
                    curso: "ADMIN",
                    codigo_autenticacao: String(this.stringAleatoria),
                    tipo_utilizador: "ADMIN"
                }
            }).then((admin_criado) => {
                res.status(201).json(admin_criado);
            }).catch((err) => {
                res.status(400).json(err);
            });
        })).catch((err) => {
            res.status(400).json(err);
        });
    }
}
exports.default = AdminController;
