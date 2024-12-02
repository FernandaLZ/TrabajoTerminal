"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../routes/user"));
const cors_1 = __importDefault(require("cors")); // Importar cors
class Server {
    constructor() {
        var _a;
        this.app = (0, express_1.default)();
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000";
        this.listen();
        this.middlewares();
        this.routes();
        console.log(process.env.PORT);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicacion corriendo en: " + this.port);
        });
    }
    routes() {
        this.app.use('/api/users', user_1.default);
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:4200', // Allow requests from your Angular frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
            preflightContinue: false, // Don't send a response on OPTIONS requests automatically
        }));
        this.app.use(express_1.default.json());
    }
}
exports.default = Server;
