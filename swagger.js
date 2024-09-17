import swaggerAutogen from "swagger-autogen";
import LoginModel from "./models/loginModel.js";
import UsuarioModel from "./models/usuarioModel.js";
import PerfilModel from "./models/perfilModel.js";

const doc = {
    info: {
        title: "Dom Barbearia",
        description: "API criada para a Barbearia Dom Fonseca"
    },
    host: 'localhost:5000',
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
        schemas: {
            loginModel: new LoginModel("teste@teste.com", "123").toJSON(),
            usuarioModel: new UsuarioModel(999, "Fulano", "123abc", "fulano@unoeste.br", new PerfilModel(1, "Adminstrador")).toJSON(),
        },
    }
}

const outputJson = "./swagger-output.json";
const routes = ['./server.js']

swaggerAutogen({openapi: '3.0.0'})(outputJson, routes, doc)
.then( async () => {
    await import('./server.js');
})