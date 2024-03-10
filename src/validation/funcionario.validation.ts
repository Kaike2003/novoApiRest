import { z } from "zod"


export const Schema_criar_funcionario = z.object({
    email: z.string().email(),
    nome: z.string().min(3).max(40),
    telefone: z.number().min(111111111).max(999999999),
    palavra_passe: z.string().min(4).max(30),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const Schema_autenticar_funcionario = z.object({
    codigo_autenticacao: z.string().min(10)
})

export const Schema_recuperar_palavra_passe_funcionario = z.object({
    email: z.string().email(),
})

export const Schema_atualizar_palavra_passe_funcionario = z.object({
    palavra_passe_antiga: z.string().min(4),
    palavra_passe_nova: z.string().min(4),
})

export const Schema_login_funcionario = z.object({
    email: z.string().email(),
    palavra_passe: z.string().min(4)
})

export type TSchema_criar_funcionario = z.infer<typeof Schema_criar_funcionario>
export type TSchema_autenticar_funcionario = z.infer<typeof Schema_autenticar_funcionario>
export type TSchema_recuperar_palavra_passe_funcionario = z.infer<typeof Schema_recuperar_palavra_passe_funcionario>
export type TSchema_atualizar_palavra_passe_funcionario = z.infer<typeof Schema_atualizar_palavra_passe_funcionario>
export type TSchema_login_funcionario = z.infer<typeof Schema_login_funcionario>