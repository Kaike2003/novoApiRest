import { hash } from "bcrypt"

export default class PalavraPasse {
    public Encriptar(senha: string) {
        return hash(senha, 8)
    }
}