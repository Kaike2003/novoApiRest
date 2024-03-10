import { Router } from "express";
import RotasPublicasController from "../controllers/rotas_publicas/RotasPublicas.controller";


export default class RotasPublicas extends RotasPublicasController {

    routerPublicas = Router()

    constructor() {
        super()
        this.rotasPublicas()
    }


    protected rotasPublicas() {
        this.routerPublicas.get("/listar_todos_achados", super.listar_todos_achados)
        this.routerPublicas.get("/listar_todos_achados_limite/:limite", super.listar_todos_achados_limite)
        this.routerPublicas.get("/listar_todos_utilizadores", super.listar_todos_utilizadores)
        this.routerPublicas.get("/listar_todos_admin", super.listar_todos_admin)
        this.routerPublicas.get("/listar_todos_estudante", super.listar_todos_estudante)
        this.routerPublicas.get("/listar_todos_funcionario", super.listar_todos_funcionario)
        this.routerPublicas.get("/listar_todos_perdidos", super.listar_todos_perdidos)
        this.routerPublicas.get("/listar_todos_perdidos_limite/:limite", super.listar_todos_perdidos_limite)
        this.routerPublicas.get("/listar_todos_entregue", super.listar_todos_entregue)

        this.routerPublicas.get("/listar_todos_bilhete_identidade_achados_limite/:limite", super.listar_todos_bilhete_identidade_achados_limite)
        this.routerPublicas.get("/listar_todos_bilhete_identidade_perdidos_limite/:limite", super.listar_todos_bilhete_identidade_perdidos_limite)

        this.routerPublicas.get("/listar_todos_carta_conducao_achados_limite/:limite", super.listar_todos_carta_conducao_achados_limite)
        this.routerPublicas.get("/listar_todos_carta_conducao_perdidos_limite/:limite", super.listar_todos_carta_conducao_perdidos_limite)

        this.routerPublicas.get("/listar_todos_livrete_achados_limite/:limite", super.listar_todos_livrete_achados_limite)
        this.routerPublicas.get("/listar_todos_livrete_perdidos_limite/:limite", super.listar_todos_livrete_perdidos_limite)

        this.routerPublicas.get("/listar_todos_passaporte_achados_limite/:limite", super.listar_todos_passaporte_achados_limite)
        this.routerPublicas.get("/listar_todos_passaporte_perdidos_limite/:limite", super.listar_todos_passaporte_perdidos_limite)

        this.routerPublicas.post("/listar_todos_pesquisado", super.listar_todos_pesquisado)

    }


}