import { Request, Response } from "express";
import { prisma } from "../../../prisma/prisma";

import { CronJob } from 'cron';
import { SchemaPesquisar, TSchemaPesquisar } from "../../validation/estudante.validation";


const job = new CronJob(
    '* * * * * *', async () => {


        const response = await prisma.documento.findMany({
            where: {
                aprovado: false,
                entregue: false,
                publicado: true,
            }
        })

        response.map(async (data) => {

            if (typeof data.id === "string") {
                if (data.foto === "perdido.jpeg" || data.foto === "achado.jpeg") {
                    return
                } else {
                    const aprovar = await prisma.documento.update({
                        data: {
                            aprovado: true
                        },
                        where: {
                            id: data.id
                        }
                    }
                    )
                    console.log("Documento aprovado::", aprovar.id)
                    return aprovar
                }
            } else {
                return console.log(data.id)
            }

        })


    },
    null, // onComplete
    true, // start
);


export default class RotasPublicasController {

    protected async listar_todos_utilizadores(req: Request, res: Response) {

        const result = await prisma.utilizador.findMany()

        res.status(200).json(result)

    }

    protected async listar_todos_admin(req: Request, res: Response) {

        const result = await prisma.utilizador.findMany({
            where: {
                tipo_utilizador: "ADMIN"
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_estudante(req: Request, res: Response) {

        const result = await prisma.utilizador.findMany({
            where: {
                tipo_utilizador: "ESTUDANTE"
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_funcionario(req: Request, res: Response) {

        const result = await prisma.utilizador.findMany({
            where: {
                tipo_utilizador: "FUNCIONARIO"
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_achados(req: Request, res: Response) {

        const result = await prisma.documento.findMany({
            where: {
                achado: true
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_achados_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    achado: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_perdidos(req: Request, res: Response) {

        const result = await prisma.documento.findMany({
            where: {
                perdido: true
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_perdidos_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    perdido: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_entregue(req: Request, res: Response) {

        const result = await prisma.documento.findMany({
            where: {
                entregue: true
            }
        })

        res.status(200).json(result)

    }

    protected async listar_todos_bilhete_identidade_achados_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "BILHETE_IDENTIDADE",
                    achado: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_bilhete_identidade_perdidos_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "BILHETE_IDENTIDADE",
                    perdido: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_carta_conducao_achados_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "CARTA_CONDUCAO",
                    achado: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_carta_conducao_perdidos_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "CARTA_CONDUCAO",
                    perdido: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_livrete_achados_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "LIVRETE",
                    achado: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_livrete_perdidos_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "LIVRETE",
                    perdido: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_passaporte_achados_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "PASSAPORTE",
                    achado: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_passaporte_perdidos_limite(req: Request, res: Response) {

        const { limite } = req.params

        if (Number(limite) >= 1) {

            const result = await prisma.documento.findMany({
                where: {
                    tipo_documento: "PASSAPORTE",
                    perdido: true
                },
                take: Number(limite)
            })

            res.status(200).json(result)

        } else {
            res.status(400).json(limite)
        }



    }

    protected async listar_todos_pesquisado(req: Request, res: Response) {

        const { pesquisar, tipo_documento, perdido, achado }: TSchemaPesquisar = req.body

        SchemaPesquisar.parseAsync({
            pesquisar: pesquisar,
            tipo_documento: tipo_documento,
            perdido: perdido,
            achado: achado
        }).then(async (sucesso_validacao) => {

            if (sucesso_validacao.tipo_documento === "BILHETE_IDENTIDADE" || sucesso_validacao.tipo_documento === "CARTA_CONDUCAO" || sucesso_validacao.tipo_documento === "LIVRETE" || sucesso_validacao.tipo_documento === "PASSAPORTE") {
                const response = await prisma.documento.findMany({
                    take: 50,
                    where: {
                        entregue: false,
                        aprovado: true,
                        publicado: true,
                        achado: sucesso_validacao.achado,
                        perdido: sucesso_validacao.perdido,
                        tipo_documento: `${sucesso_validacao.tipo_documento}`,

                        OR: [

                            {
                                nome: {
                                    in: `${sucesso_validacao.pesquisar}`
                                }
                            }
                            ,

                            {
                                nome: {
                                    startsWith: `${sucesso_validacao.pesquisar.substring(0, 4)}`,
                                },
                            }
                            ,
                            {
                                nome: {
                                    endsWith: `${sucesso_validacao.pesquisar.slice(2)}`
                                }
                            },


                        ]
                    }
                })

                res.status(200).json(response)
            } else {
                res.status(404).json(tipo_documento)
            }

        }).catch((error) => {
            res.status(400).json(error)
        })

    }

}

