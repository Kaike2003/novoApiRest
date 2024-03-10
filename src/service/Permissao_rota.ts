import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { prisma } from '../../prisma/prisma';

interface TokenPlayload {
    utilizador_id: string
    iat: number
    exp: number
}

export default class Permissao_rota {

    public async permissao_rota_admin(tipo_utilizador: string) {

        return async (req: Request, res: Response, next: NextFunction) => {

            const segredo = "process.env.SECRET_JWT"
            const { authorization } = req.headers

            if (!authorization) {
                res.status(401).json(`Authorization está nulo`)
            } else {
                const token = authorization?.replace("Bearer", "").trim()
                try {
                    const data_token = jwt.verify(token, segredo)
                    const { utilizador_id } = data_token as TokenPlayload
                    const cargo = await prisma.utilizador.findUnique({
                        where: {
                            id: utilizador_id
                        }
                    })
                    if (!cargo) {
                        res.status(400).json(`O cargo nao deve ser nulo.`)
                    } else {
                        if (cargo.tipo_utilizador === tipo_utilizador && cargo.id === utilizador_id) {
                            next()
                        } else {
                            res.status(403).json(`Acesso negado, rota só para administrador`)
                        }
                    }
                } catch (error) {
                    res.status(400).json(error)
                }
            }
        }

    }

    public async permissao_rota_estudante(tipo_utilizador: string) {

        return async (req: Request, res: Response, next: NextFunction) => {

            const segredo = "process.env.SECRET_JWT"
            const { authorization } = req.headers

            if (!authorization) {
                res.status(401).json(`Authorization está nulo`)
            } else {
                const token = authorization?.replace("Bearer", "").trim()
                try {
                    const data_token = jwt.verify(token, segredo)
                    const { utilizador_id } = data_token as TokenPlayload
                    const cargo = await prisma.utilizador.findUnique({
                        where: {
                            id: utilizador_id
                        }
                    })
                    if (!cargo) {
                        res.status(400).json(`O cargo nao deve ser nulo.`)
                    } else {
                        if (cargo.tipo_utilizador === tipo_utilizador && cargo.id === utilizador_id) {
                            next()
                        } else {
                            res.status(403).json(`Acesso negado, rota só para estudante`)
                        }
                    }
                } catch (error) {
                    res.status(400).json(error)
                }
            }
        }

    }

    public async permissao_rota_funcionario(tipo_utilizador: string) {

        return async (req: Request, res: Response, next: NextFunction) => {

            const segredo = "process.env.SECRET_JWT"
            const { authorization } = req.headers

            console.log(authorization)

            if (!authorization) {
                res.status(401).json(`Authorization está nulo`)
            } else {
                const token = authorization?.replace("Bearer", "").trim()
                try {
                    const data_token = jwt.verify(token, segredo)
                    const { utilizador_id } = data_token as TokenPlayload
                    const cargo = await prisma.utilizador.findUnique({
                        where: {
                            id: utilizador_id
                        }
                    })
                    if (!cargo) {
                        res.status(400).json(`O cargo nao deve ser nulo.`)
                    } else {
                        if (cargo.tipo_utilizador === tipo_utilizador && cargo.id === utilizador_id) {
                            next()
                        } else {
                            res.status(403).json(`Acesso negado, rota só para funcionario`)
                        }
                    }
                } catch (error) {
                    res.status(400).json(error)
                }
            }
        }

    }

}