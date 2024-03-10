import { Router } from "express";
import EstudanteController from "../controllers/estudante/Estudante.controller";
import Permissao_rota from "../service/Permissao_rota";
import { Tipo } from "@prisma/client";
import CarregarFoto from "../service/Carregar_foto";

export default class EstudanteRouter extends EstudanteController {

    public router_Estudante = Router()

    constructor() {
        super()
        this.rotas_estudante()
    }

    protected async rotas_estudante() {

        const tipo_utilizador = Tipo
        const carregar_foto_perdido = new CarregarFoto().carregar_foto("perdido")
        const carregar_foto_achado = new CarregarFoto().carregar_foto("achado")
        const permissao_estudante = await new Permissao_rota().permissao_rota_estudante(tipo_utilizador.ESTUDANTE)

        // Conta
        this.router_Estudante.post("/login_estudante", super.login_estudante)
        this.router_Estudante.post("/criar_estudante", super.criar_estudante)
        this.router_Estudante.put('/recuperar_palavra_passe_estudante', super.recuperar_palavra_passe_estudante)
        this.router_Estudante.put("/autenticar_estudante", super.autenticar_estudante)
        this.router_Estudante.put("/atualizar_palavra_passe_estudante/:id_utilizador",
            permissao_estudante
            , super.atualizar_palavra_passe_estudante)

        this.router_Estudante.put("/atualizar_perfil_informacoes_estudante/:id_utilizador",
            permissao_estudante,
            super.atualizar_perfil_informacoes
        );

        this.router_Estudante.put("/atualizar_perfil_telefone",
            permissao_estudante,
            super.atualizar_perfil_telefone
        );

        this.router_Estudante.put("/atualizar_perfil_email",
            permissao_estudante,
            super.atualizar_perfil_email
        );



        // Funcionalidades
        this.router_Estudante.post('/criar_documento_perdido_estudante/:id_utilizador',
            permissao_estudante,
            carregar_foto_perdido.single("foto"),
            super.perdi_um_documento
        )
        this.router_Estudante.put("/atualizar_documento_perdido_estudante/:id_utilizador/:id_documento",
            permissao_estudante,
            carregar_foto_perdido.single("foto"),
            super.atualizar_perdi_um_documento
        )

        this.router_Estudante.delete("/deletar_perdi_um_documento/:id_utilizador/:id_documento",
            permissao_estudante,
            super.deletar_perdi_um_documento
        )

        this.router_Estudante.post('/criar_documento_achado_estudante/:id_utilizador',
            permissao_estudante,
            carregar_foto_achado.single("foto"),
            super.achei_um_documento
        )
        this.router_Estudante.put("/atualizar_documento_achado_estudante/:id_utilizador/:id_documento",
            permissao_estudante,
            carregar_foto_achado.single("foto"),
            super.atualizar_achei_um_documento
        )

        this.router_Estudante.delete("/deletar_achado_um_documento/:id_utilizador/:id_documento",
            permissao_estudante,
            super.deletar_achado_um_documento
        )

        this.router_Estudante.put("/pertence_documento_achado/:id_utilizador/:id_documento",
            permissao_estudante,
            super.pertence_me_achado_documento
        )

        this.router_Estudante.get("/listar_documento_perdido_estudante/:id_utilizador",
            permissao_estudante,
            super.listar_documento_perdidos
        )

        this.router_Estudante.get("/listar_documento_achado_estudante/:id_utilizador",
            permissao_estudante,
            super.listar_documento_achados
        )

        this.router_Estudante.put("/publicar_documento/:id_utilizador/:id_documento",
            permissao_estudante,
            super.publicar_documento
        )

    }


}