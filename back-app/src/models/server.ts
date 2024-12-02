import express, {Application} from 'express';
import routerUser from '../routes/user';
import cors from 'cors'; // Importar cors

class Server{
    private app: Application;
    private port: string;
    constructor(){
        this.app = express();
        this.port = process.env.PORT??"3000";
        this.listen();
        this.middlewares();
        this.routes();
        console.log(process.env.PORT)
    }
    

    listen(){
        this.app.listen(this.port,()=>{
            console.log("Aplicacion corriendo en: " + this.port)
        })
    }

    routes(){
        this.app.use('/api/users',routerUser)
    }

    middlewares() {
        this.app.use(cors({
            origin: 'http://localhost:4200', // Allow requests from your Angular frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
            preflightContinue: false, // Don't send a response on OPTIONS requests automatically
        }));
        this.app.use(express.json()); 
    }
}
export default Server