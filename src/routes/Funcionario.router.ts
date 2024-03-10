import { Router } from "express"
import AdminController from "../controllers/admin/Admin.controller"
import Permissao_rota from "../service/Permissao_rota"
import { Tipo } from "@prisma/client"
import FuncinarioController from "../controllers/funcionario/Funcionario.controller"
import CarregarFoto from "../service/Carregar_foto"

export default class FuncionarioRouter extends FuncinarioController {

    public routerFuncionario = Router()

    constructor() {
        super()
        this.rotas_Funcionario()
    }

    protected async rotas_Funcionario() {

        const tipo_utilizador = Tipo
        const carregar_foto_perdido = new CarregarFoto().carregar_foto("perdido")
        const carregar_foto_achado = new CarregarFoto().carregar_foto("achado")
        const permissao_funcionario = await new Permissao_rota().permissao_rota_funcionario(tipo_utilizador.FUNCIONARIO)

        this.routerFuncionario.post("/criar_funcionario", super.criar_funcionario)
        this.routerFuncionario.put("/autenticar_funcionario", super.autenticar_funcionario)
        this.routerFuncionario.put("/recuperar_palavra_passe_funcionario", super.recuperar_palavra_passe_funcioario)
        this.routerFuncionario.put("/atualizar_palavra_passe_funcionario/:id_utilizador",
            permissao_funcionario
            , super.atualizar_palavra_passe_funcionario)
        this.routerFuncionario.post("/login_funcionario", super.login_funcionario)
        this.routerFuncionario.put("/atualizar_perfil_informacoes_funcionario/:id_utilizador",
            permissao_funcionario,
            super.atualizar_perfil_informacoes
        );

        this.routerFuncionario.put("/atualizar_perfil_telefone",
            permissao_funcionario,
            super.atualizar_perfil_telefone
        );

        this.routerFuncionario.put("/atualizar_perfil_email",
            permissao_funcionario,
            super.atualizar_perfil_email
        );



        // Funcionalidades
        this.routerFuncionario.post('/criar_documento_perdido_funcionario/:id_utilizador',
            permissao_funcionario,
            carregar_foto_perdido.single("foto"),
            super.perdi_um_documento
        )
        this.routerFuncionario.put("/atualizar_documento_perdido_funcionario/:id_utilizador/:id_documento",
            permissao_funcionario,
            carregar_foto_perdido.single("foto"),
            super.atualizar_perdi_um_documento
        )

        this.routerFuncionario.delete("/deletar_perdi_um_documento/:id_utilizador/:id_documento",
            permissao_funcionario,
            super.deletar_perdi_um_documento
        )

        this.routerFuncionario.post('/criar_documento_achado_funcionario/:id_utilizador',
            permissao_funcionario,
            carregar_foto_achado.single("foto"),
            super.achei_um_documento
        )
        this.routerFuncionario.put("/atualizar_documento_achado_funcionario/:id_utilizador/:id_documento",
            permissao_funcionario,
            carregar_foto_achado.single("foto"),
            super.atualizar_achei_um_documento
        )

        this.routerFuncionario.delete("/deletar_achado_um_documento/:id_utilizador/:id_documento",
            permissao_funcionario,
            super.deletar_achado_um_documento
        )

        this.routerFuncionario.put("/pertence_documento_achado/:id_utilizador/:id_documento",
            permissao_funcionario,
            super.pertence_me_achado_documento
        )

        this.routerFuncionario.put("/pertence_esta_comigo/:id_utilizador/:id_documento",
            permissao_funcionario,
            super.esta_comigo_documento
        )

        this.routerFuncionario.put("/publicar_documento/:id_utilizador/:id_documento",
            permissao_funcionario,
            super.publicar_documento
        )

        this.routerFuncionario.get("/listar_documento_perdido_funcionario/:id_utilizador",
            permissao_funcionario,
            super.listar_documento_perdidos
        )

        this.routerFuncionario.get("/listar_documento_achado_funcionario/:id_utilizador",
            permissao_funcionario,
            super.listar_documento_achados
        )


    }

}