import multer from "multer"




export default class CarregarFoto {

    public carregar_foto(perdido_achado: string) {

        const storage = multer.diskStorage({

            filename(req, file, callback) {
                const nome_imagem = new Date().getTime() + file.originalname
                console.log("nome alterado", nome_imagem)
                callback(null, nome_imagem)
            },

            destination(req, file, callback) {

                if (perdido_achado === "perdido") {
                    const path = "./public/carregado/perdido"
                    callback(null, path)
                }

                if (perdido_achado === "achado") {
                    const path = "./public/carregado/achado"
                    callback(null, path)
                }


            },

        })

        return multer({ storage })

    }

}