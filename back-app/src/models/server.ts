import express, {Application} from 'express';
import routerUser from '../routes/user'

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
        this.app.use(express.json()); 
    }
}
export default Server