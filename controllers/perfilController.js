import PerfilModel from "../models/perfilModel.js"


export default class PerfilController {

    async listar(req, res) {
        try{
            let perfil = new PerfilModel();
            let listaPerfil = await perfil.listar();
            res.status(200).json(listaPerfil);
        }
        catch(ex) {
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
        
    }

}