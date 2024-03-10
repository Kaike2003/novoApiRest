import { Schema_atualizar_documento_achei, Schema_atualizar_documento_perdido, Schema_criar_documento_achei, Schema_criar_documento_perdido, Schema_pertence_me_documento, TSchema_atualizar_documento_achei, TSchema_atualizar_documento_perdido, TSchema_criar_documento_achei, TSchema_pertence_me_documento } from './../../validation/estudante.validation';
import { Request, Response } from "express";
import { TSchema_criar_documento_perdido } from "../../validation/estudante.validation";
import { prisma } from '../../../prisma/prisma';
import { Classe, Curso, Tipo_Documento } from '@prisma/client';
import Entregue_notificacao from '../../service/Entregue_notificacao';
import EstaComigoNotificacao from '../../service/Esta_comigo_notificacao';
import { Schema_atualizar_perfil_email, Schema_atualizar_perfil_informacao, Schema_atualizar_perfil_telefone, TSchema_atualizar_perfil_email, TSchema_atualizar_perfil_informacao, TSchema_atualizar_perfil_telefone } from '../../validation/admin.validation';

export default class FuncionalidadesController {

    public async perdi_um_documento(req: Request, res: Response) {

        const { tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao }: TSchema_criar_documento_perdido = req.body

        const { id_utilizador } = req.params
        const foto_carregada = req.file?.filename

        Schema_criar_documento_perdido.parseAsync({
            tipo_documento: tipo_documento,
            nome_documento: nome_documento,
            numero_identificacao: numero_identificacao,
            filiacao: filiacao,
            onde_perdeu: onde_perdeu,
            data_perdeu: new Date(data_perdeu),
            telefone: Number(telefone),
            email: email,
            descricao: descricao
        }).then(async (sucesso_validacao) => {

            const tipo_documento_sistema = Tipo_Documento

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (result_utilizador.id === id_utilizador) {

                            if (tipo_documento_sistema.BILHETE_IDENTIDADE === tipo_documento || tipo_documento_sistema.CARTA_CONDUCAO === tipo_documento || tipo_documento_sistema.LIVRETE === tipo_documento || tipo_documento_sistema.PASSAPORTE === tipo_documento) {

                                const result_documento = await prisma.documento.create({
                                    data: {
                                        nome: sucesso_validacao.nome_documento,
                                        email: sucesso_validacao.email,
                                        tipo_documento: tipo_documento,
                                        numero_identificacao: sucesso_validacao.numero_identificacao,
                                        data: new Date(sucesso_validacao.data_perdeu),
                                        filicao: sucesso_validacao.filiacao,
                                        local: sucesso_validacao.onde_perdeu,
                                        foto: foto_carregada === undefined ? "perdido.jpeg" : String(foto_carregada),
                                        telefone: sucesso_validacao.telefone,
                                        descricao: sucesso_validacao.descricao,
                                        achado: false,
                                        perdido: true,
                                        publicado: false,
                                        aprovado: false,
                                        utilizadorId: id_utilizador
                                    }
                                })


                                res.status(200).json(result_documento)

                            } else {
                                res.status(400).json(`Esse tipo de documento ${tipo_documento} nao existe no Suchen.`)
                            }


                        }
                    }
                }



            }


        }).catch((err) => {
            res.status(400).json(err)
        })

    }

    public async atualizar_perdi_um_documento(req: Request, res: Response) {

        const { tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao }: TSchema_atualizar_documento_perdido = req.body
        const { id_utilizador, id_documento } = req.params
        const foto_carregada = req.file?.filename


        console.log(foto_carregada)
        console.log(id_utilizador, id_documento)

        console.log("Dados", [tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao])

        Schema_atualizar_documento_perdido.parseAsync({
            tipo_documento: tipo_documento,
            nome_documento: nome_documento,
            numero_identificacao: numero_identificacao,
            filiacao: filiacao,
            onde_perdeu: onde_perdeu,
            data_perdeu: new Date(data_perdeu),
            telefone: Number(telefone),
            email: email,
            descricao: descricao
        }).then(async (sucesso_validacao) => {

            const tipo_documento_sistema = Tipo_Documento

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (!id_documento) {
                            res.status(400).json(`Por favor digite o numero do documento`)
                        } else {

                            if (id_documento.length >= 15) {
                                const result_id_documento = await prisma.documento.findUnique({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                if (result_id_documento?.id === id_documento) {

                                    if (result_utilizador.id === id_utilizador) {

                                        if (tipo_documento_sistema.BILHETE_IDENTIDADE === tipo_documento || tipo_documento_sistema.CARTA_CONDUCAO === tipo_documento || tipo_documento_sistema.LIVRETE === tipo_documento || tipo_documento_sistema.PASSAPORTE === tipo_documento) {

                                            const result_documento = await prisma.documento.update({
                                                where: {
                                                    id: result_id_documento.id
                                                },
                                                data: {
                                                    nome: sucesso_validacao.nome_documento || result_id_documento.nome,
                                                    email: sucesso_validacao.email || result_id_documento.email,
                                                    tipo_documento: tipo_documento,
                                                    data: new Date(sucesso_validacao.data_perdeu),
                                                    numero_identificacao: sucesso_validacao.numero_identificacao,
                                                    filicao: sucesso_validacao.filiacao,
                                                    local: sucesso_validacao.onde_perdeu,
                                                    telefone: sucesso_validacao.telefone,
                                                    descricao: sucesso_validacao.descricao,
                                                    foto: foto_carregada === undefined ? foto_carregada : result_id_documento.foto,
                                                    achado: false,
                                                    perdido: true,
                                                    utilizadorId: id_utilizador
                                                }
                                            })


                                            res.status(200).json(result_documento)

                                        } else {
                                            res.status(400).json(`Esse tipo de documento ${tipo_documento} nao existe no Suchen.`)
                                        }

                                    }

                                } else {
                                    res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                                }

                            }

                        }


                    }
                }



            }


        }).catch((err) => {
            res.status(400).json(err)
        })

    }

    public async deletar_perdi_um_documento(req: Request, res: Response) {

        const { id_utilizador, id_documento } = req.params

        if (!id_utilizador) {
            res.status(400).json(`Por favor digite o numero do utilizador`)
        } else {

            if (id_utilizador.length >= 15) {

                if (!id_documento) {
                    res.status(400).json(`Por favor digite o id do documento`)
                } else {

                    if (id_documento.length >= 15) {

                        const result_id_utilizador = await prisma.utilizador.findUnique({
                            where: {
                                id: id_utilizador
                            }
                        })

                        if (result_id_utilizador?.id === id_utilizador) {

                            const result_id_documento = await prisma.documento.findUnique({
                                where: {
                                    id: id_documento
                                }
                            })


                            if (result_id_documento?.id === id_documento) {

                                const result_deletar_documento = await prisma.documento.delete({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                res.status(200).json(result_deletar_documento)

                            } else {
                                res.status(400).json(`Esse documento ${id_documento} nao existe no Suchen.`)
                            }

                        } else {
                            res.status(400).json(`Esse utilizador ${id_utilizador} nao existe no Suchen.`)
                        }

                    }
                }

            }
        }

    }

    public async achei_um_documento(req: Request, res: Response) {

        const { tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao }: TSchema_criar_documento_achei = req.body
        const { id_utilizador } = req.params
        const foto_carregada = req.file?.filename

        console.log("Foto", foto_carregada)


        console.log("dados", [tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao])

        Schema_criar_documento_achei.parseAsync({
            tipo_documento: tipo_documento,
            nome_documento: nome_documento,
            numero_identificacao: numero_identificacao,
            filiacao: filiacao,
            onde_perdeu: onde_perdeu,
            data_perdeu: new Date(data_perdeu),
            telefone: Number(telefone),
            email: email,
            descricao: descricao
        }).then(async (sucesso_validacao) => {

            const tipo_documento_sistema = Tipo_Documento

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (result_utilizador.id === id_utilizador) {

                            if (tipo_documento_sistema.BILHETE_IDENTIDADE === tipo_documento || tipo_documento_sistema.CARTA_CONDUCAO === tipo_documento || tipo_documento_sistema.LIVRETE === tipo_documento || tipo_documento_sistema.PASSAPORTE === tipo_documento) {

                                const result_documento = await prisma.documento.create({
                                    data: {
                                        nome: sucesso_validacao.nome_documento,
                                        email: sucesso_validacao.email,
                                        tipo_documento: tipo_documento,
                                        numero_identificacao: sucesso_validacao.numero_identificacao,
                                        data: new Date(sucesso_validacao.data_perdeu),
                                        filicao: sucesso_validacao.filiacao,
                                        local: sucesso_validacao.onde_perdeu,
                                        telefone: sucesso_validacao.telefone,
                                        descricao: sucesso_validacao.descricao,
                                        foto: foto_carregada === undefined ? "achado.jpeg" : String(foto_carregada),
                                        achado: true,
                                        perdido: false,
                                        publicado: false,
                                        aprovado: false,
                                        utilizadorId: id_utilizador
                                    }
                                })


                                res.status(200).json(result_documento)

                            } else {
                                res.status(400).json(`Esse tipo de documento ${tipo_documento} nao existe no Suchen.`)
                            }


                        }
                    }
                }



            }


        }).catch((err) => {
            res.status(400).json(err)
        })

    }

    public async atualizar_achei_um_documento(req: Request, res: Response) {

        const { tipo_documento, numero_identificacao, nome_documento, filiacao, onde_perdeu, data_perdeu, telefone, email, descricao }: TSchema_atualizar_documento_achei = req.body
        const { id_utilizador, id_documento } = req.params
        const foto_carregada = req.file?.filename

        console.log(foto_carregada)

        Schema_atualizar_documento_achei.parseAsync({
            tipo_documento: tipo_documento,
            nome_documento: nome_documento,
            numero_identificacao: numero_identificacao,
            filiacao: filiacao,
            onde_perdeu: onde_perdeu,
            data_perdeu: new Date(data_perdeu),
            telefone: Number(telefone),
            email: email,
            descricao: descricao
        }).then(async (sucesso_validacao) => {

            const tipo_documento_sistema = Tipo_Documento

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (!id_documento) {
                            res.status(400).json(`Por favor digite o numero do documento`)
                        } else {

                            if (id_documento.length >= 15) {
                                const result_id_documento = await prisma.documento.findUnique({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                if (result_id_documento?.id === id_documento) {

                                    if (result_utilizador.id === id_utilizador) {

                                        if (tipo_documento_sistema.BILHETE_IDENTIDADE === tipo_documento || tipo_documento_sistema.CARTA_CONDUCAO === tipo_documento || tipo_documento_sistema.LIVRETE === tipo_documento || tipo_documento_sistema.PASSAPORTE === tipo_documento) {

                                            const result_documento = await prisma.documento.update({
                                                where: {
                                                    id: result_id_documento.id
                                                },
                                                data: {
                                                    nome: sucesso_validacao.nome_documento || result_id_documento.nome,
                                                    email: sucesso_validacao.email || result_id_documento.email,
                                                    tipo_documento: tipo_documento,
                                                    numero_identificacao: sucesso_validacao.numero_identificacao,
                                                    data: new Date(sucesso_validacao.data_perdeu),
                                                    filicao: sucesso_validacao.filiacao,
                                                    local: sucesso_validacao.onde_perdeu,
                                                    telefone: sucesso_validacao.telefone,
                                                    descricao: sucesso_validacao.descricao,
                                                    foto: foto_carregada === undefined ? result_id_documento.foto : foto_carregada,
                                                    achado: true,
                                                    perdido: false,

                                                    utilizadorId: id_utilizador
                                                }
                                            })


                                            res.status(200).json(result_documento)

                                        } else {
                                            res.status(400).json(`Esse tipo de documento ${tipo_documento} nao existe no Suchen.`)
                                        }

                                    }

                                } else {
                                    res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                                }

                            }

                        }


                    }
                }



            }


        }).catch((err) => {
            res.status(400).json(err)
        })

    }

    public async deletar_achado_um_documento(req: Request, res: Response) {

        const { id_utilizador, id_documento } = req.params

        if (!id_utilizador) {
            res.status(400).json(`Por favor digite o numero do utilizador`)
        } else {

            if (id_utilizador.length >= 15) {

                if (!id_documento) {
                    res.status(400).json(`Por favor digite o id do documento`)
                } else {

                    if (id_documento.length >= 15) {

                        const result_id_utilizador = await prisma.utilizador.findUnique({
                            where: {
                                id: id_utilizador
                            }
                        })

                        if (result_id_utilizador?.id === id_utilizador) {

                            const result_id_documento = await prisma.documento.findUnique({
                                where: {
                                    id: id_documento
                                }
                            })


                            if (result_id_documento?.id === id_documento) {

                                const result_deletar_documento = await prisma.documento.delete({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                res.status(200).json(result_deletar_documento)

                            } else {
                                res.status(400).json(`Esse documento ${id_documento} nao existe no Suchen.`)
                            }

                        } else {
                            res.status(400).json(`Esse utilizador ${id_utilizador} nao existe no Suchen.`)
                        }

                    }
                }

            }
        }

    }

    public async pertence_me_achado_documento(req: Request, res: Response) {

        const { numero_documento_filiacao, telefone }: TSchema_pertence_me_documento = req.body
        const { id_utilizador, id_documento } = req.params

        Schema_pertence_me_documento.parseAsync({
            numero_documento_filiacao: numero_documento_filiacao,
            telefone: telefone
        }).then(async (sucesso_validacao) => {

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (!id_documento) {
                            res.status(400).json(`Por favor digite o numero do documento`)
                        } else {

                            if (id_documento.length >= 15) {
                                const result_id_documento = await prisma.documento.findUnique({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                if (result_id_documento?.id === id_documento) {

                                    if (result_utilizador.id === id_utilizador) {
                                        if (result_id_documento.filicao === sucesso_validacao.numero_documento_filiacao || result_id_documento.numero_identificacao === sucesso_validacao.numero_documento_filiacao || result_id_documento.achado === true) {


                                            if (result_id_documento.entregue === false) {


                                                const result_esta_comigo_documento = await prisma.documento.update({
                                                    where: {
                                                        id: result_id_documento.id
                                                    },
                                                    data: {
                                                        entregue: true
                                                    }
                                                })

                                                const result_publicou_na_suchen = await prisma.utilizador.findUnique({
                                                    where: {
                                                        id: result_esta_comigo_documento.utilizadorId
                                                    }
                                                })

                                                if (!result_publicou_na_suchen) {
                                                    res.status(400).json(result_publicou_na_suchen)
                                                } else {

                                                    const email_publicou_na_suchen = result_publicou_na_suchen?.email
                                                    const nome_publicou_na_suchen = result_publicou_na_suchen?.nome

                                                    new Entregue_notificacao().enviar_sms_usuario(email_publicou_na_suchen, nome_publicou_na_suchen, sucesso_validacao.telefone, result_esta_comigo_documento.nome)

                                                    res.status(200).json(result_esta_comigo_documento)

                                                }



                                            } else {
                                                res.status(400).json(`Esse documento ja foi entregue ao dono`)
                                            }



                                        } else {
                                            res.status(400).json(`Esse tipo de documento ${result_id_documento.nome} nao existe no Suchen.`)
                                        }

                                    }

                                } else {
                                    res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                                }

                            }

                        }


                    }
                }



            }

        }).catch((err) => {
            res.status(400).json(err)
        })


    }

    public async esta_comigo_documento(req: Request, res: Response) {

        const { numero_documento_filiacao, telefone }: TSchema_pertence_me_documento = req.body
        const { id_utilizador, id_documento } = req.params

        Schema_pertence_me_documento.parseAsync({
            numero_documento_filiacao: numero_documento_filiacao,
            telefone: telefone
        }).then(async (sucesso_validacao) => {

            if (!id_utilizador) {
                res.status(400).json(`Por favor digite o numero do utilizador`)
            } else {

                if (id_utilizador.length >= 15) {
                    const result_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (!result_utilizador) {
                        res.status(400).json(`Utilizador nao existe na Suchen`)
                    } else {

                        if (!id_documento) {
                            res.status(400).json(`Por favor digite o numero do documento`)
                        } else {

                            if (id_documento.length >= 15) {
                                const result_id_documento = await prisma.documento.findUnique({
                                    where: {
                                        id: id_documento
                                    }
                                })

                                if (result_id_documento?.id === id_documento) {

                                    if (result_utilizador.id === id_utilizador) {
                                        if (result_id_documento.filicao === sucesso_validacao.numero_documento_filiacao || result_id_documento.numero_identificacao === sucesso_validacao.numero_documento_filiacao || result_id_documento.perdido === true) {


                                            if (result_id_documento.entregue === false) {


                                                const result_pertence_me = await prisma.documento.update({
                                                    where: {
                                                        id: result_id_documento.id
                                                    },
                                                    data: {
                                                        entregue: true
                                                    }
                                                })

                                                const result_publicou_na_suchen = await prisma.utilizador.findUnique({
                                                    where: {
                                                        id: result_pertence_me.utilizadorId
                                                    }
                                                })

                                                if (!result_publicou_na_suchen) {
                                                    res.status(400).json(result_publicou_na_suchen)
                                                } else {

                                                    const email_publicou_na_suchen = result_publicou_na_suchen?.email
                                                    const nome_publicou_na_suchen = result_publicou_na_suchen?.nome

                                                    new EstaComigoNotificacao().enviar_sms_usuario(email_publicou_na_suchen, nome_publicou_na_suchen, sucesso_validacao.telefone, result_pertence_me.nome)

                                                    res.status(200).json(result_pertence_me)

                                                }



                                            } else {
                                                res.status(400).json(`Esse documento ja foi entregue ao dono`)
                                            }



                                        } else {
                                            res.status(400).json(`Esse tipo de documento ${result_id_documento.nome} nao existe no Suchen.`)
                                        }

                                    }

                                } else {
                                    res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                                }

                            }

                        }


                    }
                }
            }

        }).catch((err) => {
            res.status(400).json(err)
        })

    }

    public async publicar_documento(req: Request, res: Response) {

        const { id_utilizador, id_documento } = req.params


        if (!id_utilizador) {
            res.status(400).json(`Por favor digite o numero do utilizador`)
        } else {

            if (id_utilizador.length >= 15) {
                const result_utilizador = await prisma.utilizador.findUnique({
                    where: {
                        id: id_utilizador
                    }
                })

                if (!result_utilizador) {
                    res.status(400).json(`Utilizador nao existe na Suchen`)
                } else {

                    if (!id_documento) {
                        res.status(400).json(`Por favor digite o numero do documento`)
                    } else {

                        if (id_documento.length >= 15) {
                            const result_id_documento = await prisma.documento.findUnique({
                                where: {
                                    id: id_documento
                                }
                            })
                            if (result_id_documento?.id === id_documento) {
                                if (result_utilizador.id === id_utilizador) {

                                    if (result_id_documento.publicado === false) {
                                        console.log(result_id_documento.foto)
                                        if (result_id_documento.foto === null || result_id_documento.foto === "achado.jpeg" || result_id_documento.foto === "perdido.jpeg") {
                                            res.status(400).json(`Este documento está sem foto, adicione primeiro uma foto ao documento e depois publicar.`)
                                        } else {
                                            const result_publicado = await prisma.documento.update({
                                                where: {
                                                    id: result_id_documento.id
                                                },
                                                data: {
                                                    publicado: true
                                                }
                                            })

                                            res.status(200).json(result_publicado)
                                        }
                                    } else {
                                        res.status(200).json(`Este documento já foi publicado.`)
                                    }


                                }
                            } else {
                                res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                            }
                        }
                    }
                }
            }
        }


    }

    public async aprovar_documento(req: Request, res: Response) {

        const { id_utilizador, id_documento } = req.params

        if (!id_utilizador) {
            res.status(400).json(`Por favor digite o numero do utilizador`)
        } else {

            if (id_utilizador.length >= 15) {
                const result_utilizador = await prisma.utilizador.findUnique({
                    where: {
                        id: id_utilizador
                    }
                })

                if (!result_utilizador) {
                    res.status(400).json(`Utilizador nao existe na Suchen`)
                } else {

                    if (!id_documento) {
                        res.status(400).json(`Por favor digite o numero do documento`)
                    } else {

                        if (id_documento.length >= 15) {
                            const result_id_documento = await prisma.documento.findUnique({
                                where: {
                                    id: id_documento
                                }
                            })
                            if (result_id_documento?.id === id_documento) {
                                if (result_utilizador.id === id_utilizador) {

                                    if (result_id_documento.publicado === false) {

                                        res.status(200).json(`Este documento ainda nao foi publicado.`)

                                    } else {

                                        if (result_id_documento.aprovado === false) {

                                            const result_publicado = await prisma.documento.update({
                                                where: {
                                                    id: result_id_documento.id
                                                },
                                                data: {
                                                    aprovado: true
                                                }
                                            })
                                            res.status(200).json(result_publicado)


                                        } else {

                                            res.status(200).json(`Este documento ja foi aprovado.`)
                                        }


                                    }


                                }
                            } else {
                                res.status(400).json(`O do tipo de documento ${id_documento} nao existe no Suchen.`)
                            }
                        }
                    }
                }
            }
        }


    }

    protected async listar_documento_perdidos(req: Request, res: Response) {

        const { id_utilizador } = req.params

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

                        await prisma.documento.findMany({
                            where: {
                                utilizadorId: result_id_utilizador.id,
                                perdido: true,
                                achado: false
                            }
                        }).then((sucesso_perdido) => {
                            res.status(200).json(sucesso_perdido)
                        }).catch((error) => {
                            res.status(400).json(error)
                        })

                    }

                }

            }

        }

    }

    protected async listar_documento_achados(req: Request, res: Response) {

        const { id_utilizador } = req.params

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

                        await prisma.documento.findMany({
                            where: {
                                utilizadorId: result_id_utilizador.id,
                                perdido: false,
                                achado: true
                            }
                        }).then((sucesso_achado) => {
                            res.status(200).json(sucesso_achado)
                        }).catch((error) => {
                            res.status(400).json(error)
                        })

                    }

                }

            }

        }

    }

    protected async banir_utilizador(req: Request, res: Response) {

        const { id_utilizador } = req.params


        if (id_utilizador.length >= 20 && typeof id_utilizador === "string") {

            const response = await prisma.utilizador.findUnique({
                where: {
                    id: id_utilizador
                }
            })

            if (response?.id === id_utilizador) {

                if (response.banido === "FALSE") {
                    const responseBanido = await prisma.utilizador.update({
                        where: {
                            id: response.id
                        },
                        data: {
                            banido: "TRUE"
                        }
                    })

                    res.status(200).json(responseBanido)

                } else {
                    const responseBanido = await prisma.utilizador.update({
                        where: {
                            id: response.id
                        },
                        data: {
                            banido: "FALSE"
                        }
                    })

                    res.status(200).json(responseBanido)

                }

            } else {
                res.status(400).json(id_utilizador)
            }

        }

    }

    protected async atualizar_perfil_informacoes(req: Request, res: Response) {

        const { nome, email, classe, curso, data_nascimento }: TSchema_atualizar_perfil_informacao = req.body

        const { id_utilizador } = req.params

        const classe_sistema = Classe
        const curso_sistema = Curso

        Schema_atualizar_perfil_informacao.parseAsync({
            nome: nome,
            email: email,
            classe: classe,
            curso: curso,
            data_nascimento: new Date(data_nascimento),
        }).then(async (sucesso_validacacao) => {

            if (typeof id_utilizador === "string") {


                if (id_utilizador.length >= 15) {



                    const result_id_utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: id_utilizador
                        }
                    })

                    if (result_id_utilizador?.id === id_utilizador) {


                        if (sucesso_validacacao.curso === curso_sistema.BIOQUIMICA || sucesso_validacacao.curso === curso_sistema.DESENHADOR || sucesso_validacacao.curso === curso_sistema.ENERGIAS || sucesso_validacacao.curso === curso_sistema.INFORMATICA || sucesso_validacacao.curso === curso_sistema.INFORMATICA || sucesso_validacacao.curso === curso_sistema.MAQUINAS || sucesso_validacacao.curso === curso_sistema.NONA || sucesso_validacacao.curso === curso_sistema.OITAVA || sucesso_validacacao.curso === curso_sistema.SETIMA || sucesso_validacacao.curso === curso_sistema.ADMIN || sucesso_validacacao.curso === curso_sistema.FUNCIONARIO) {

                            if (sucesso_validacacao.classe === classe_sistema.DECIMA || sucesso_validacacao.classe === classe_sistema.PRIMEIRA || sucesso_validacacao.classe === classe_sistema.SEGUNDA || sucesso_validacacao.classe === classe_sistema.TERCEIRA || sucesso_validacacao.classe === classe_sistema.ADMIN || sucesso_validacacao.classe === classe_sistema.FUNCIONARIO) {


                                const resutl = await prisma.utilizador.update({
                                    where: {
                                        id: result_id_utilizador.id
                                    },
                                    data: {
                                        nome: sucesso_validacacao.nome,
                                        email: sucesso_validacacao.email === undefined ? result_id_utilizador.email : sucesso_validacacao.email,
                                        data_nascimento: new Date(sucesso_validacacao.data_nascimento),
                                        classe: sucesso_validacacao.classe,
                                        curso: sucesso_validacacao.curso,
                                    }
                                })

                                res.status(201).json(resutl)

                            }

                        }



                    }


                } else {
                    res.status(400).json(id_utilizador.length)
                }

            } else {
                res.status(400).json(typeof id_utilizador)
            }




        })

    }

    protected async atualizar_perfil_telefone(req: Request, res: Response) {

        const { telefone }: TSchema_atualizar_perfil_telefone = req.body


        Schema_atualizar_perfil_telefone.parseAsync({
            telefone: Number(telefone)
        }).then(async (sucesso_validacao) => {

            const responseTelefone = await prisma.utilizador.findUnique({
                where: {
                    telefone: sucesso_validacao.telefone
                }
            })

            if (responseTelefone?.telefone === sucesso_validacao.telefone) {


                res.status(400).json(`O numero ${sucesso_validacao.telefone} ja esta sendo utilizado na shucen.`)

            } else {


                const response = await prisma.utilizador.update({
                    where: {
                        id: responseTelefone?.id
                    },
                    data: {
                        telefone: responseTelefone?.telefone
                    }
                })

                res.status(200).json(response)


            }

        }).catch((error) => {
            res.status(400).json(error)
        })

    }

    protected async atualizar_perfil_email(req: Request, res: Response) {

        const { email }: TSchema_atualizar_perfil_email = req.body


        Schema_atualizar_perfil_email.parseAsync({
            email: email
        }).then(async (sucesso_validacao) => {

            const responseEmail = await prisma.utilizador.findUnique({
                where: {
                    email: sucesso_validacao.email
                }
            })

            if (responseEmail?.email === sucesso_validacao.email) {


                res.status(400).json(`O numero ${sucesso_validacao.email} ja esta sendo utilizado na shucen.`)

            } else {


                const response = await prisma.utilizador.update({
                    where: {
                        id: responseEmail?.id
                    },
                    data: {
                        email: responseEmail?.email
                    }
                })

                res.status(200).json(`O seu email ${responseEmail?.email} foi alterado com sucesso.`)


            }

        }).catch((error) => {
            res.status(400).json(error)
        })

    }

}