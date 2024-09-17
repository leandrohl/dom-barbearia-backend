import express from 'express'
import usuarioRoute from './routes/usuariosRoute.js';
import perfilRoute from './routes/perfilRoute.js';
import loginRouter from './routes/loginRoute.js'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const outputJson = require("./swagger-output.json");
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

//configura as ferramentas de parser
app.use(cookieParser());
app.use(express.json());

//faz a liberação para requisições em outras portas
app.use(cors({origin: "http://localhost:3000", credentials: true}))

//página de documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson));

app.use('/usuarios', usuarioRoute);
app.use('/perfil', perfilRoute);
app.use('/login', loginRouter);

// app.use('/locacao', 
//     //#swagger.tags = ['Locação']
//     /* #swagger.security = [{
//             "bearerAuth": []
//     }] */
// locacaoRouter)

app.listen(5000, function() {
    console.log("backend em execução");
})