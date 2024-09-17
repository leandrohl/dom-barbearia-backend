import PerfilModel from "../models/perfilModel.js";
import UsuarioModel from "../models/usuarioModel.js";



export default class UsuarioController {

    async listar(req, res) {
        try{
            let usuario = new UsuarioModel();
            let listaUsuarios = await usuario.listar()
            res.status(200).json(listaUsuarios);
        }
        catch(ex) {
            res.status(500).json(
                {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                detalhes: ex.message})
        }
        
    }

    async obter(req, res) {  
        try{
            let { id } = req.params;
            let usuario = new UsuarioModel();
            let usuarioEncontrado = await usuario.obter(id);
            if(usuarioEncontrado != null) {
                res.status(200).json(usuarioEncontrado);
            }
            else{
                res.status(404).json({msg: "Usuário não encontrado"});
            }
        }   
        catch(ex) {
            res.status(500).json(
                {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                detalhes: ex.message})
        }
    }

    async excluir(req, res) {
        try{
            let usuario = new UsuarioModel();
            let { id } = req.params;
            if(await usuario.obter(id) != null) {
                let result = await usuario.deletar(id);
                if(result) {
                    res.status(200).json({msg: "Exclusão realizada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro interno de servidor"});
                }
            }   
            else {
                res.status(404).json({msg: "Usuário não encontrado para exclusão!"});
            }
        }
        catch(ex) {
                res.status(500).json(
                    {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                    detalhes: ex.message})
            
        }

    }

    async atualizar(req, res) {
        try{
            if(req.body) {
                let { usuId, usuNome, usuEmail, usuSenha, perfil } = req.body;
                if(usuId > 0 && usuNome != "" && usuEmail != "" && usuSenha != "" && perfil.perfilId > 0) {
                    
                    let usuario = new UsuarioModel(usuId, usuNome, usuEmail, usuSenha, new PerfilModel(perfil.perfilId));
                    
                    if(await usuario.obter(usuId) != null) {
                        let result = await usuario.gravar();
                    
                        if(result) {
                            res.status(200).json({msg: "Usuário atualizado com sucesso!"});
                        }
                        else {
                            res.status(500).json({msg: "Erro interno de servidor"});
                        }
                    }
                    else {
                        res.status(404).json({msg: "Usuário não encontrado para alteração"});
                    }
                }
                else{
                    res.status(400).json({msg: "Existem campos que não foram preenchidos!"})
                }
            }
            else {
                res.status(400).json({msg: "Preencha corretamente os dados do usuário!"})
            }
        }
        catch(ex) {
            res.status(500).json(
                {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                detalhes: ex.message})
        
        }
    }

    async alterarEmail(req, res) {
        try{
            let achou = false;
            if(req.body) {
                if(req.body.email != "") {
                    let { id } = req.params;
                    let { email } = req.body;
                    let usuario = new UsuarioModel();
                    if(await usuario.obter(id) != null) {
                        let result = await usuario.alterarEmail(id, email);
                        if(result) {
                            res.status(200).json({msg: "Email alterado"});
                        }
                        else{
                            res.status(500).json({msg: "Erro interno de servidor"});
                        }
                    }
                    else{
                        res.status(404).json({msg: "Usuário não encontrado para alteração de email"});
                    }
                }
                else{
                    res.status(400).json({msg: "O campo e-mail está vazio!"});
                }
            }
            else{
                res.status(400).json({msg: "Preencha o e-mail a ser alterado!"});
            }
        }
        catch(ex) {
            res.status(500).json(
                {msg: "Erro inesperado! Entre em contato com o nosso suporte técnico.",
                detalhes: ex.message})
        }
        
    }

    async criar(req, res) {
        try{
            if(req.body) {
                let { usuNome, usuEmail, usuSenha, perfil } = req.body;
                if(usuNome != "" && usuEmail != "" && usuSenha != "" && perfil.perfilId > 0){

                    let usuario = new UsuarioModel();
                    usuario.usuId = 0;
                    usuario.usuNome = usuNome;
                    usuario.usuEmail = usuEmail;
                    usuario.usuSenha = usuSenha;
                    usuario.perfil = new PerfilModel(perfil.perfilId);

                    let result = await usuario.gravar();
                    if(result) {
                        res.status(201).json({msg: "Usuário cadastrado com sucesso!"});    
                    }
                    else{
                        res.status(500).json({msg: "Erro interno de servidor! (2)"})
                    }
                          
                }
                else {
                    res.status(418).json({msg: "Por favor, preencha todas as informações do usuário"})
                }
            }
            else {
                res.status(400).json({msg: "Por favor, informe os dados do usuário"})
            }
        }
        catch(ex) {
            res.status(500).json(
                {msg: "Erro interno de servidor! (1)",
                detalhes: ex.message})
        
        }
        
    }
}