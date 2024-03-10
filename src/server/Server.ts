import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import AdminRouter from "../routes/Admin.router"
import taxa_limite from "express-rate-limit"
import EstudanteRouter from "../routes/Estudante.router"
import FuncionarioRouter from "../routes/Funcionario.router"
import RotasPublicas from "../routes/RotasPublicas"

export default class Server {

    private express: express.Application

    constructor() {
        this.express = express()
        this.middleware()
        this.todas_rotas()
    }

    private todas_rotas() {
        const nome_caminho_principal = "suchen"
        this.express.use(`/${nome_caminho_principal}/admin`, new AdminRouter().routerAdmin)
        this.express.use(`/${nome_caminho_principal}/estudante`, new EstudanteRouter().router_Estudante)
        this.express.use(`/${nome_caminho_principal}/funcionario`, new FuncionarioRouter().routerFuncionario)
        this.express.use(`/${nome_caminho_principal}/publico`, new RotasPublicas().routerPublicas)
    }

    private middleware() {

        dotenv.config()
        this.express.use(express.json())
        this.express.use(express.urlencoded())
        this.express.use(morgan("dev"))
        this.express.use(cors())
        this.express.use("/public", express.static("public"))

        this.express.get("/", (req: Request, res: Response) => {
            res.status(200).json("Rota principal funcionando")
        })

        taxa_limite({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        })
    }

    public porta(porta: number) {
        this.express.listen(porta || process.env.PORTA_SERVIDOR, () => {
            console.log(`Servidor funcionando na porta ${porta || process.env.PORTA_SERVIDOR}`)
        })
    }

}