import { Router } from "express"
import AdminController from "../controllers/admin/Admin.controller"
import Permissao_rota from "../service/Permissao_rota"
import { Tipo } from "@prisma/client"
import CarregarFoto from "../service/Carregar_foto"

export default class AdminRouter extends AdminController {

    public routerAdmin = Router()

    constructor() {
        super()
        this.rotas_Admin()
    }

    protected async rotas_Admin() {

        const tipo_utilizador = Tipo
        const carregar_foto_perdido = new CarregarFoto().carregar_foto("perdido")
        const carregar_foto_achado = new CarregarFoto().carregar_foto("achado")
        const permissao_admin = await new Permissao_rota().permissao_rota_admin(tipo_utilizador.ADMIN)

        this.routerAdmin.post("/criar_admin", super.criar_admin)
        this.routerAdmin.put("/autenticar_admin", super.autenticar_admin)
        this.routerAdmin.put("/recuperar_palavra_passe_admin", super.recuperar_palavra_passe_admin)
        this.routerAdmin.put("/atualizar_palavra_passe_admin/:id_utilizador",
            permissao_admin
            , super.atualizar_palavra_passe_admin)
        this.routerAdmin.post("/login_admin", super.login_admin)

        this.routerAdmin.put("/atualizar_perfil_informacoes_admin/:id_utilizador",
            permissao_admin,
            super.atualizar_perfil_informacoes
        );

        this.routerAdmin.put("/atualizar_perfil_telefone",
            permissao_admin,
            super.atualizar_perfil_telefone
        );

        this.routerAdmin.put("/atualizar_perfil_email",
            permissao_admin,
            super.atualizar_perfil_email
        );


        // Funcionalidades
        this.routerAdmin.post('/criar_documento_perdido_admin/:id_utilizador',
            permissao_admin,
            carregar_foto_perdido.single("foto"),
            super.perdi_um_documento
        )
        this.routerAdmin.put("/atualizar_documento_perdido_admin/:id_utilizador/:id_documento",
            permissao_admin,
            carregar_foto_perdido.single("foto"),
            super.atualizar_perdi_um_documento
        )

        this.routerAdmin.delete("/deletar_perdi_um_documento/:id_utilizador/:id_documento",
            permissao_admin,
            super.deletar_perdi_um_documento
        )


        this.routerAdmin.post('/criar_documento_achado_admin/:id_utilizador',
            permissao_admin,
            carregar_foto_achado.single("foto"),
            super.achei_um_documento
        )
        this.routerAdmin.put("/atualizar_documento_achado_admin/:id_utilizador/:id_documento",
            permissao_admin,
            carregar_foto_achado.single("foto"),
            super.atualizar_achei_um_documento
        )

        this.routerAdmin.delete("/deletar_achado_um_documento/:id_utilizador/:id_documento",
            permissao_admin,
            super.deletar_achado_um_documento
        )

        this.routerAdmin.put("/pertence_documento_achado/:id_utilizador/:id_documento",
            permissao_admin,
            super.pertence_me_achado_documento
        )

        this.routerAdmin.put("/aprovar_documento/:id_utilizador/:id_documento",
            permissao_admin,
            super.aprovar_documento
        )

        this.routerAdmin.get("/listar_documento_perdido_admin/:id_utilizador",
            permissao_admin,
            super.listar_documento_perdidos
        )

        this.routerAdmin.get("/listar_documento_achado_admin/:id_utilizador",
            permissao_admin,
            super.listar_documento_achados
        )

        this.routerAdmin.put("/banirUtilizador_admin/:id_utilizador",
            permissao_admin,
            super.banir_utilizador
        )

        this.routerAdmin.put("/publicar_documento/:id_utilizador/:id_documento",
            permissao_admin,
            super.publicar_documento
        )



    }

}