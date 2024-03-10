import bcrypt from "bcrypt"


export default class CompararPalavraPasse {

    public async comparar_palavra_passe(palavra_passe_atual: string, palavra_passe_base_dados: string) {

        const palavra_passe_correta = bcrypt.compareSync(palavra_passe_atual, palavra_passe_base_dados)

        if (!palavra_passe_correta) {
            return (`A palavra passe ${palavra_passe_atual} está incorreta.`)
        } else {
            return palavra_passe_correta
        }

    }

}