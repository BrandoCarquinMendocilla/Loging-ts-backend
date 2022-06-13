import Express from "express";
import morgan from "morgan"
import helmet from "helmet";
import mongoose from "mongoose";
import compression from 'compression';
import cors from 'cors';
import UserRoutes from "./routes/UserRoutes";
class Server {
    public app: Express.Application
    constructor() {
        this.app = Express();
        this.config();
        this.routes();
    }

    config() {
        const MONGO_URI = 'mongodb://localhost/userbackend';
        mongoose.set("runValidators", true);
        mongoose.connect(MONGO_URI || process.env.MONFODB_URL, {
            autoIndex: true
        }).then(bd => console.log("Data Base is conect"));

        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({ extended: false }))
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }
    routes() {
        this.app.use('/api/users', UserRoutes);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port ${this.app.get('port')}`);
        });
    }
}

const server = new Server();
server.start();
