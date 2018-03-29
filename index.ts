import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as multer from 'multer';


dotenv.config();

const PORT: string | number = 8000;

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();
        this.express.use(express.static('.'));
        this.express.use(morgan('tiny'));
        router.get('/', (_, res: express.Response) => {
            return res.sendFile(path.join( __dirname, 'index.html'));
        });
        router.post('/upload', (_, res: express.Response) => {
            return res.send("Thank")
        });
        this.express.use('/', router);
    }
}

const app: express.Application = new App().express;
const server: http.Server = http.createServer(app);

server.listen(PORT, (err: Error): void | never => {
    if (err) {
        throw err;
    }
    /* tslint:disable */ 
    return console.log('Server listening on PORT: ' + PORT);
    /* tslint:enable */
});
