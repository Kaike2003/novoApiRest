import { Schema_atualizar_palavra_passe_admin, Schema_criar_admin, Schema_recuperar_palavra_passe_admin, TSchema_atualizar_palavra_passe_admin, TSchema_autenticar_admin, TSchema_criar_admin, TSchema_recuperar_palavra_passe_admin, Schema_login_admin, TSchema_login_admin } from './../../validation/admin.validation';
import { Request, Response } from "express";
import PalavraPasse from '../../service/PalavraPasse';
import { prisma } from '../../../prisma/prisma';
import Nodemailer from '../../service/Nodemailer';
import GerarString from '../../service/Gerar_String';
import NodemailerPalavraPasse from '../../service/NodemailerPalavraPasse';
import CompararPalavraPasse from '../../service/Comparar_palavra_passe';
import Jwt from '../../service/Jwt';
import FuncionalidadesController from '../funcionalidades/Funcionalidades.controller';


export default class AdminController extends FuncionalidadesController {


    protected async criar_admin(req: Request, res: Response) {

        const string_aleatoria = new GerarString().geradorStrings()
        const { nome, email, palavra_passe, telefone, data_nascimento }: TSchema_criar_admin = req.body
        Schema_criar_admin.parseAsync({
            nome: nome,
            email: email,
            palavra_passe: palavra_passe,
            telefone: Number(telefone),
            data_nascimento: new Date(data_nascimento)
        }).then(async (sucesso_validacacao) => {

            const result_admin_email = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacacao.email
                }
            })

            const result_admin_telefone = await prisma.utilizador.findUnique({
                where: {
                    telefone: Number(sucesso_validacacao.telefone)
                }
            })

            if (result_admin_telefone?.telefone === sucesso_validacacao.telefone) {

                res.status(400).json(`Já existe um conta cadastrada com esse número ${result_admin_telefone.telefone}. Usa outro número de telefone.`)

            } else {

                if (result_admin_email?.email === sucesso_validacacao.email) {

                    res.status(400).json(`Já existe um conta cadastrada com o email ${result_admin_email.email}. Usa outro email.`)

                } else {

                    const result_admin = await prisma.utilizador.create({
                        data: {
                            nome: sucesso_validacacao.nome,
                            email: sucesso_validacacao.email,
                            palavra_passe: await new PalavraPasse().Encriptar(sucesso_validacacao.palavra_passe),
                            telefone: sucesso_validacacao.telefone,
                            data_nascimento: new Date(sucesso_validacacao.data_nascimento),
                            codigo_autenticacao: String(string_aleatoria),
                            classe: "ADMIN",
                            curso: "ADMIN",
                            tipo_utilizador: "ADMIN"
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

                }


            }


        }).catch((err) => {
            res.status(400).json(err)
        })
    }

    protected async autenticar_admin(req: Request, res: Response) {
        const { codigo_autenticacao }: TSchema_autenticar_admin = req.body

        const result_codigo_autenticacao = await prisma.utilizador.findFirst({
            where: { codigo_autenticacao: codigo_autenticacao }
        })

        if (!result_codigo_autenticacao) {
            res.status(400).json(`Por favor, verifica o seu email e obtenha o código de autenticacao que enviamos para ti.`)
        } else {

            if (result_codigo_autenticacao.autenticado === "TRUE" && result_codigo_autenticacao.tipo_utilizador === "ADMIN") {
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

    protected async recuperar_palavra_passe_admin(req: Request, res: Response) {
        const { email }: TSchema_recuperar_palavra_passe_admin = req.body

        const string_aleatoria = new GerarString().geradorStrings()

        Schema_recuperar_palavra_passe_admin.parseAsync({
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
                if (result_email.email === email && result_email.tipo_utilizador === 'ADMIN') {
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

    protected async atualizar_palavra_passe_admin(req: Request, res: Response) {
        const { palavra_passe_antiga, palavra_passe_nova }: TSchema_atualizar_palavra_passe_admin = req.body
        const { id_utilizador } = req.params

        try {

            Schema_atualizar_palavra_passe_admin.parseAsync({
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

                                if (comparado_palavra_passe === true && result_id_utilizador.tipo_utilizador === "ADMIN") {

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

    protected async login_admin(req: Request, res: Response) {
        const { email, palavra_passe }: TSchema_login_admin = req.body

        Schema_login_admin.parseAsync({
            email: email,
            palavra_passe: palavra_passe
        }).then(async (sucesso_validacao) => {



            const result_email = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacao.email
                }
            })

            if (!result_email) {

                res.status(400).json(`O email ${email} não existe no suchen`)

            } else {

                if (result_email.email === sucesso_validacao.email) {

                    if (result_email.banido === "TRUE") {
                        res.status(400).json(`${result_email.email} sua conta está banida da suchen.`)
                    } else {

                        if (result_email.autenticado === "FALSE") {
                            res.status(400).json(`${result_email.email} sua conta não autenticada na suchen. Autentica a sua conta.`)
                        } else {

                            if (result_email.tipo_utilizador === "ADMIN") {

                                const senha_correta = await new CompararPalavraPasse().comparar_palavra_passe(sucesso_validacao.palavra_passe, result_email.palavra_passe)


                                if (senha_correta === true) {
                                    const logado = new Jwt().token_sign(result_email.id)
                                    console.log(logado)
                                    res.status(200).json(logado)
                                } else {
                                    res.status(400).json(`A sua palavra passe está incorreta.`)
                                }

                            } else {

                                res.status(400).json(`${result_email.email} tente iniciar sessão nas rotas funcionario ou estudante.`)

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

