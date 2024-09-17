import express from 'express'
import UsuarioController from '../controllers/usuarioController.js'
import Autenticacao from '../middlewares/autenticacao.js';

let router = express.Router();

let ctrl = new UsuarioController();
let auth = new Autenticacao();
router.get('/', auth.validar, (req, res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Lista os usuários cadastrados'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});
router.get('/:id', auth.validar, (req, res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Retorna um usuário baseado em um id'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res)
});
router.post('/', auth.validar, (req, res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Cadastra um usuário no banco de dados'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/usuarioModel"
                }
            }
            
        }
    }*/
    ctrl.criar(req, res);
});
router.delete('/excluir/:id', auth.validar, (req, res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Exclui um usuário baseado em um id' 
    /* #swagger.security = [{
            "bearerAuth": []
    }] */ 
    ctrl.excluir(req, res);
});
router.put('/', auth.validar, (req, res) => {   
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Atualiza todos os atributos de um usuário no banco de dados'    
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/usuarioModel"
                }
            }
            
        }
    }*/
    ctrl.atualizar(req, res);
});
router.patch('/alterar-email/:id', auth.validar, (req, res) => {
    // #swagger.tags = ['Usuários']
    // #swagger.summary = 'Atualiza apenas o e-mail de um usuário'
    // #swagger.parameters['id'] = { description: 'ID do usuário que terá o e-mail atualizado' }
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterarEmail(req, res);
});

export default router;