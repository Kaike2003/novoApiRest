import { z } from "zod"


export const Schema_criar_admin = z.object({
    email: z.string().email(),
    nome: z.string().min(3).max(40),
    telefone: z.number().min(111111111).max(999999999),
    palavra_passe: z.string().min(4).max(30),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const Schema_autenticar_admin = z.object({
    codigo_autenticacao: z.string().min(10)
})

export const Schema_recuperar_palavra_passe_admin = z.object({
    email: z.string().email(),
})

export const Schema_atualizar_palavra_passe_admin = z.object({
    palavra_passe_antiga: z.string().min(4),
    palavra_passe_nova: z.string().min(4),
})

export const Schema_login_admin = z.object({
    email: z.string().email(),
    palavra_passe: z.string().min(4)
})

export const Schema_atualizar_perfil_informacao = z.object({
    email: z.string().email().optional(),
    nome: z.string().min(3).max(40),
    curso: z.string().min(2),
    classe: z.string().min(2),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const Schema_atualizar_perfil_telefone = z.object({
    telefone: z.number().min(111111111).max(999999999),
})


export const Schema_atualizar_perfil_email = z.object({
    email: z.string().email(),
})

export type TSchema_criar_admin = z.infer<typeof Schema_criar_admin>
export type TSchema_autenticar_admin = z.infer<typeof Schema_autenticar_admin>
export type TSchema_recuperar_palavra_passe_admin = z.infer<typeof Schema_recuperar_palavra_passe_admin>
export type TSchema_atualizar_palavra_passe_admin = z.infer<typeof Schema_atualizar_palavra_passe_admin>
export type TSchema_login_admin = z.infer<typeof Schema_login_admin>
export type TSchema_atualizar_perfil_informacao = z.infer<typeof Schema_atualizar_perfil_informacao>
export type TSchema_atualizar_perfil_telefone = z.infer<typeof Schema_atualizar_perfil_telefone>
export type TSchema_atualizar_perfil_email = z.infer<typeof Schema_atualizar_perfil_email>
