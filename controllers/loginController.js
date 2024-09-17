import Autenticacao from "../middlewares/autenticacao.js";
import LoginModel from "../models/loginModel.js";
import UsuarioModel from "../models/usuarioModel.js";

export default class LoginController {

    async autenticar(req, res) {
        try{
            if(req.body) {
                let { email, senha } = req.body;
                let loginModel = new LoginModel(email, senha)
                if(await loginModel.autenticar()) {
                    //gerar jwt
                    let usuario = new UsuarioModel();
                    usuario = await usuario.obterPorEmailSenha(email, senha);
                    usuario.usuSenha = "";
                    let auth = new Autenticacao();
                    let token = auth.gerarToken(usuario.toJSON())
                    
                    res.cookie("jwt", token, {
                        httpOnly: true
                    })

                    res.status(200).json({tokenAcesso: token, usuario: usuario});
                }
                else {
                    res.status(404).json({msg: "Usuário/senha inválidos"});
                }
            }
            else {
                res.status(400).json({msg: "Usuário e senha não informados"});
            } 
        }
        catch(ex) {
            res.status(500).json({msg: "Erro interno de servidor"});
        }
        
    }

}