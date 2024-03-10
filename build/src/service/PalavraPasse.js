"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
class PalavraPasse {
    Encriptar(senha) {
        return (0, bcrypt_1.hash)(senha, 8);
    }
}
exports.default = PalavraPasse;
