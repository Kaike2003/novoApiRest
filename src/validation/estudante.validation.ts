import { z } from "zod"

export const Schema_criar_estudante = z.object({
    email: z.string().email(),
    nome: z.string().min(3).max(40),
    telefone: z.number().min(111111111).max(999999999),
    palavra_passe: z.string().min(4).max(30),
    curso: z.string().min(2),
    classe: z.string().min(2),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const Schema_autenticar_estudante = z.object({
    codigo_autenticacao: z.string().min(10)
})

export const Schema_login_estudante = z.object({
    email: z.string().email(),
    palavra_passe: z.string().min(4)
})

export const Schema_recuperar_palavra_passe_estudante = z.object({
    email: z.string().email(),
})

export const Schema_atualizar_palavra_passe_estudante = z.object({
    palavra_passe_antiga: z.string().min(4),
    palavra_passe_nova: z.string().min(4),
})

export const Schema_criar_documento_perdido = z.object({
    tipo_documento: z.string().min(4).max(50),
    nome_documento: z.string().min(4).max(50),
    filiacao: z.string().min(4).max(100).optional(),
    numero_identificacao: z.string().min(4).max(50),
    onde_perdeu: z.string().min(4).max(50),
    data_perdeu: z.date(),
    telefone: z.number().min(111111111).max(999999999),
    email: z.string().email().optional(),
    descricao: z.string().min(20).max(500)
})

export const Schema_criar_documento_achei = z.object({
    tipo_documento: z.string().min(4).max(50),
    numero_identificacao: z.string().min(4).max(50),
    nome_documento: z.string().min(4).max(50),
    filiacao: z.string().min(4).max(100).optional(),
    onde_perdeu: z.string().min(4).max(50),
    data_perdeu: z.date(),
    telefone: z.number().min(111111111).max(999999999),
    email: z.string().email().optional(),
    descricao: z.string().min(20).max(300)
})


export const Schema_atualizar_documento_perdido = z.object({
    tipo_documento: z.string().min(4).max(50),
    nome_documento: z.string().min(4).max(50),
    filiacao: z.string().min(4).max(100),
    numero_identificacao: z.string().min(4).max(70),
    onde_perdeu: z.string().min(4).max(50),
    data_perdeu: z.date(),
    telefone: z.number().min(111111111).max(999999999),
    email: z.string().email(),
    descricao: z.string().min(20).max(500)
})

export const Schema_atualizar_documento_achei = z.object({
    tipo_documento: z.string().min(4).max(50).optional(),
    nome_documento: z.string().min(4).max(50).optional(),
    numero_identificacao: z.string().min(4).max(50).optional(),
    filiacao: z.string().min(4).max(100).optional().optional(),
    onde_perdeu: z.string().min(4).max(50).optional(),
    data_perdeu: z.date(),
    telefone: z.number().min(111111111).max(999999999).optional(),
    email: z.string().email().optional(),
    descricao: z.string().min(20).max(500).optional()
})

export const Schema_pertence_me_documento = z.object({
    numero_documento_filiacao: z.string().min(4).max(60).optional(),
    telefone: z.number().min(111111111).max(999999999),
})

export const Schema_esta_comigo_documento = z.object({
    numero_documento_filiacao: z.string().min(4).max(60).optional(),
    telefone: z.number().min(111111111).max(999999999),
})

export const SchemaPesquisar = z.object({
    pesquisar: z.string().min(3).max(60),
    tipo_documento: z.string().min(3).max(60),
    perdido: z.boolean(),
    achado: z.boolean()
})

export type TSchema_criar_estudante = z.infer<typeof Schema_criar_estudante>
export type TSchema_autenticar_estudante = z.infer<typeof Schema_autenticar_estudante>
export type TSchema_login_estudante = z.infer<typeof Schema_login_estudante>
export type TSchema_recuperar_palavra_passe_estudante = z.infer<typeof Schema_recuperar_palavra_passe_estudante>
export type TSchema_atualizar_palavra_passe_estudante = z.infer<typeof Schema_atualizar_palavra_passe_estudante>
export type TSchema_criar_documento_perdido = z.infer<typeof Schema_criar_documento_perdido>
export type TSchema_atualizar_documento_perdido = z.infer<typeof Schema_atualizar_documento_perdido>
export type TSchema_criar_documento_achei = z.infer<typeof Schema_criar_documento_achei>
export type TSchema_atualizar_documento_achei = z.infer<typeof Schema_atualizar_documento_achei>
export type TSchema_pertence_me_documento = z.infer<typeof Schema_pertence_me_documento>
export type TSchema_esta_comigo_documento = z.infer<typeof Schema_esta_comigo_documento>
export type TSchemaPesquisar = z.infer<typeof SchemaPesquisar>