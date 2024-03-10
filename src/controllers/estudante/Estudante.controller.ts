import { Schema_atualizar_palavra_passe_estudante, Schema_recuperar_palavra_passe_estudante, TSchema_atualizar_palavra_passe_estudante, TSchema_recuperar_palavra_passe_estudante } from './../../validation/estudante.validation';
import { Request, Response } from "express"
import { prisma } from "../../../prisma/prisma"
import GerarString from "../../service/Gerar_String"
import Nodemailer from "../../service/Nodemailer"
import PalavraPasse from "../../service/PalavraPasse"
import { Schema_criar_estudante, Schema_login_estudante, TSchema_autenticar_estudante, TSchema_criar_estudante, TSchema_login_estudante } from "../../validation/estudante.validation"
import { Classe, Curso } from "@prisma/client"
import CompararPalavraPasse from "../../service/Comparar_palavra_passe"
import Jwt from "../../service/Jwt"
import NodemailerPalavraPasse from "../../service/NodemailerPalavraPasse"
import FuncionalidadesController from '../funcionalidades/Funcionalidades.controller';

export default class EstudanteController extends FuncionalidadesController {

    protected async criar_estudante(req: Request, res: Response) {

        const string_aleatoria = new GerarString().geradorStrings()
        const { nome, email, palavra_passe, telefone, data_nascimento, classe, curso }: TSchema_criar_estudante = req.body

        const classe_sistema = Classe
        const curso_sistema = Curso

        Schema_criar_estudante.parseAsync({
            nome: nome,
            email: email,
            palavra_passe: palavra_passe,
            telefone: telefone,
            classe: classe,
            curso: curso,
            data_nascimento: new Date(data_nascimento)
        }).then(async (sucesso_validacacao) => {


            const result_estudante_email = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacacao.email
                }
            })

            const result_estudante_telefone = await prisma.utilizador.findUnique({
                where: {
                    telefone: Number(sucesso_validacacao.telefone)
                }
            })

            if (result_estudante_telefone?.telefone === sucesso_validacacao.telefone) {

                res.status(400).json(`Já existe um conta cadastrada com esse número ${result_estudante_telefone.telefone}. Usa outro número de telefone.`)

            } else {

                if (result_estudante_email?.email === sucesso_validacacao.email) {

                    res.status(400).json(`Já existe um conta cadastrada com o email ${result_estudante_email.email}. Usa outro email.`)

                } else {

                    if (sucesso_validacacao.curso === curso_sistema.BIOQUIMICA || sucesso_validacacao.curso === curso_sistema.DESENHADOR || sucesso_validacacao.curso === curso_sistema.ENERGIAS || sucesso_validacacao.curso === curso_sistema.INFORMATICA || sucesso_validacacao.curso === curso_sistema.INFORMATICA || sucesso_validacacao.curso === curso_sistema.MAQUINAS || sucesso_validacacao.curso === curso_sistema.NONA || sucesso_validacacao.curso === curso_sistema.OITAVA || sucesso_validacacao.curso === curso_sistema.SETIMA) {

                        if (sucesso_validacacao.classe === classe_sistema.DECIMA || sucesso_validacacao.classe === classe_sistema.PRIMEIRA || sucesso_validacacao.classe === classe_sistema.SEGUNDA || sucesso_validacacao.classe === classe_sistema.TERCEIRA) {

                            const result_estudante = await prisma.utilizador.create({
                                data: {
                                    nome: sucesso_validacacao.nome,
                                    email: sucesso_validacacao.email,
                                    palavra_passe: await new PalavraPasse().Encriptar(sucesso_validacacao.palavra_passe),
                                    telefone: sucesso_validacacao.telefone,
                                    data_nascimento: new Date(sucesso_validacacao.data_nascimento),
                                    codigo_autenticacao: String(string_aleatoria),
                                    classe: sucesso_validacacao.classe,
                                    curso: sucesso_validacacao.curso,
                                    tipo_utilizador: "ESTUDANTE"
                                },
                                select: {
                                    nome: true,
                                    email: true,
                                    telefone: true,
                                    codigo_autenticacao: true,
                                    classe: true,
                                    curso: true,
                                    banido: true,
                                    tipo_utilizador: true
                                }
                            })

                            console.log(new Nodemailer().transporter(sucesso_validacacao.email, sucesso_validacacao.nome, string_aleatoria)
                            )

                            new Nodemailer().transporter(sucesso_validacacao.email, sucesso_validacacao.nome, string_aleatoria)

                            res.status(201).json(`Conta criada, verifique o seu email, acabamos de enviar o seu codigo de autenticação.`)


                        } else {
                            res.status(400).json(`A classe ${sucesso_validacacao.classe} nao existe no Suchen`)
                        }


                    } else {
                        res.status(400).json(`O curso ${sucesso_validacacao.curso} nao existe no Suchen`)
                    }



                }


            }






        }).catch((err) => {
            res.status(400).json(err)
        })
    }

    protected async autenticar_estudante(req: Request, res: Response) {
        const { codigo_autenticacao }: TSchema_autenticar_estudante = req.body

        const result_codigo_autenticacao = await prisma.utilizador.findFirst({
            where: { codigo_autenticacao: codigo_autenticacao }
        })

        if (!result_codigo_autenticacao) {
            res.status(400).json(`Por favor, verifica o seu email e obtenha o código de autenticacao que enviamos para ti.`)
        } else {

            if (result_codigo_autenticacao.autenticado === "TRUE" && result_codigo_autenticacao.tipo_utilizador === "ESTUDANTE") {
                res.status(400).json(`Está conta com o email ${result_codigo_autenticacao.email} já foi autenticada`)
            } else {
                if (result_codigo_autenticacao.codigo_autenticacao === codigo_autenticacao) {

                    const result_conta_admin_autenticada = await prisma.utilizador.update({
                        where: {
                            id: result_codigo_autenticacao.id
                        },
                        data: {
                            autenticado: "TRUE",
                        },
                        select: {
                            email: true,
                            autenticado: true
                        }
                    })

                    res.status(200).json(result_conta_admin_autenticada)
                }
            }

        }


    }

    protected async atualizar_palavra_passe_estudante(req: Request, res: Response) {
        const { palavra_passe_antiga, palavra_passe_nova }: TSchema_atualizar_palavra_passe_estudante = req.body
        const { id_utilizador } = req.params

        try {

            Schema_atualizar_palavra_passe_estudante.parseAsync({
                palavra_passe_antiga: palavra_passe_antiga,
                palavra_passe_nova: palavra_passe_nova
            }).then(async (sucesso_validacao) => {

                if (!id_utilizador) {
                    res.status(400).json(`Por favor digite o numero do utilizador`)
                } else {

                    if (id_utilizador.length >= 15) {

                        const result_id_utilizador = await prisma.utilizador.findUnique({
                            where: {
                                id: id_utilizador
                            }
                        })

                        if (!result_id_utilizador) {
                            res.status(400).json(`O id do utilizador nao existe no Suchen`)
                        } else {

                            if (result_id_utilizador.id === id_utilizador) {

                                const comparado_palavra_passe = await new CompararPalavraPasse().comparar_palavra_passe(sucesso_validacao.palavra_passe_antiga, result_id_utilizador.palavra_passe)

                                if (comparado_palavra_passe === true && result_id_utilizador.tipo_utilizador === "ESTUDANTE") {

                                    const palavra_passe_alterada = await prisma.utilizador.update({
                                        where: {
                                            email: result_id_utilizador.email
                                        },
                                        data: {
                                            palavra_passe: await new PalavraPasse().Encriptar(palavra_passe_nova)
                                        },
                                        select: {
                                            email: true,
                                            nome: true
                                        }
                                    })

                                    res.status(200).json(palavra_passe_alterada)

                                } else {
                                    res.status(400).json(`A palavra passe antiga ${palavra_passe_antiga} está incorreta.`)
                                }

                            }

                        }

                    }

                }

            }).catch((err) => {
                res.status(400).json(err)
            })

        } catch (error) {
            res.status(400).json(error)
        }


    }

    protected async recuperar_palavra_passe_estudante(req: Request, res: Response) {
        const { email }: TSchema_recuperar_palavra_passe_estudante = req.body

        const string_aleatoria = new GerarString().geradorStrings()

        Schema_recuperar_palavra_passe_estudante.parseAsync({
            email: email
        }).then(async (sucesso_validacao) => {

            const result_email = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacao.email
                }
            })

            if (!result_email) {
                res.status(400).json(`O email ${email} nao existe na aplicacao Suchen`)
            } else {
                if (result_email.email === email && result_email.tipo_utilizador === 'ESTUDANTE') {
                    const result_palavra_passe_alterada = await prisma.utilizador.update({
                        where: {
                            email: result_email.email
                        },
                        data: {
                            palavra_passe: await new PalavraPasse().Encriptar(string_aleatoria),
                        },
                        select: {
                            nome: true,
                            email: true
                        }
                    })

                    new NodemailerPalavraPasse().transporter(result_email.email, result_email.nome, string_aleatoria)

                    res.status(200).json(result_palavra_passe_alterada)
                }
            }


        }).catch((err) => {
            res.status(400).json(err)
        })


    }

    protected async login_estudante(req: Request, res: Response) {
        const { email, palavra_passe }: TSchema_login_estudante = req.body

        Schema_login_estudante.parseAsync({
            email: email,
            palavra_passe: palavra_passe
        }).then(async (sucesso_validacao) => {

            const result_email = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacao.email
                }
            })

            if (!result_email) {

                res.status(400).json(`O email ${email} não existe no suchen.`)

            } else {

                if (result_email.email === sucesso_validacao.email) {

                    if (result_email.banido === "TRUE") {
                        res.status(400).json(`${result_email.email} sua conta está banida da suchen.`)
                    } else {

                        if (result_email.autenticado === "FALSE") {
                            res.status(400).json(`${result_email.email} sua conta não autenticada na suchen. Autentica a sua conta.`)
                        } else {

                            if (result_email.tipo_utilizador === "ESTUDANTE") {

                                const senha_correta = await new CompararPalavraPasse().comparar_palavra_passe(sucesso_validacao.palavra_passe, result_email.palavra_passe)


                                if (senha_correta === true) {
                                    const logado = new Jwt().token_sign(result_email.id)
                                    console.log(logado)
                                    res.status(200).json(logado)
                                } else {
                                    res.status(400).json(`A sua palavra passe está incorreta.`)
                                }

                            } else {

                                res.status(400).json(`${result_email.email} tente iniciar sessão na rota de funcionário.`)

                            }


                        }




                    }


                } else {
                    res.status(400).json(`${sucesso_validacao.email} esse email não esta cadastrado como administrador na shucen.`)
                }
            }

        }).catch((err) => {
            res.status(400).json(err)
        })



    }



}