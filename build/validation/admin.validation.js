"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaAdmin = void 0;
const zod_1 = require("zod");
exports.SchemaAdmin = zod_1.z.object({
    email: zod_1.z.string().email(),
    nome: zod_1.z.string().min(3).max(40),
    telefone: zod_1.z.number().min(111111111).max(999999999),
    palavra_passe: zod_1.z.string().min(4).max(30),
    data_nascimento: zod_1.z.date().max(new Date())
});
