import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as multer from 'multer';
import * as fs from 'fs';
import * as process from 'process';
import { remove, map, uniq } from 'lodash';
import * as mongoose from 'mongoose';
import { spawn } from 'child_process';

import { YoloModelSchema, IYoloSchema } from './models/yolo';

const upload = multer({ dest: 'uploads/' })

dotenv.config();

const DATABASE_URL: string = 'mongodb://localhost:27017/cbir';

(<any>mongoose).Promise = global.Promise;

mongoose.connect(DATABASE_URL, (err: mongoose.Error) => {
    if (err)
        throw err;
    else
        console.log('connected');
});

function classifyImage(img: any, res: express.Response) {
    process.chdir('/home/monster/git/darknet');
    let t = spawn('./darknet', ["detect", "cfg/yolo.cfg", "yolo.weights", img])
    var cnnData = "";
    t.stdout.on('data', data => {
        cnnData += data;
    });

    t.on('close', _ => {
        (<any>fs).copyFileSync('/home/monster/git/darknet/predictions.png', '/home/monster/git/image-retrieval-yolo/uploads/custom_predictions.png');
        //console.log(cnnData.split("seconds. "));
        console.log(cnnData);
        const labels = uniq(map(remove(cnnData.replace('\n', ' ').split("seconds. ")[1].split(/% ?/), undefined)));
        const labels2 = map(labels, e => {
            let ek = e.replace('\n', '');
            return ek.substr(0, ek.indexOf(':')).trim();
        });
        return getImages(remove(labels2, undefined), res);
        //return res.status(200).send(labels);
    });
}

function getImages(labels: Array<string>, res: express.Response) {
    YoloModelSchema.find({ labels: { $in: labels }})
        .select('dirp -_id')
        .limit(30)
        .exec((err: Error, p_labels: Array<IYoloSchema>) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Sorry, error');
            }
            return res.status(200).json(JSON.stringify(p_labels));
        });
}

function classifyImage2(img: any, res: express.Response) {
    process.chdir('/home/monster/git/darknet');
    let t = spawn('./darknet', ["detect", "cfg/yolo.cfg", "yolo.weights", img])
    var cnnData = "";
    t.stdout.on('data', data => {
        cnnData += data;
    });

    t.on('close', _ => {
        (<any>fs).copyFileSync('/home/monster/git/darknet/predictions.png', '/home/monster/git/image-retrieval-yolo/uploads/custom_predictions.png');
        //console.log(cnnData.split("seconds. "));
        console.log(cnnData);
        const labels = uniq(map(remove(cnnData.replace('\n', ' ').split("seconds. ")[1].split(/% ?/), undefined)));
        const labels2 = map(labels, e => {
            let ek = e.replace('\n', '');
            return ek.substr(0, ek.indexOf(':')).trim();
        });
        return getImages2(remove(labels2, undefined), res);
        //return res.status(200).send(labels);
    });
}

function getImages2(labels: Array<string>, res: express.Response) {
    console.log(labels);
    YoloModelSchema.find({ labels: { $all: labels }})
        .select('dirp -_id')
        .limit(30)
        .exec((err: Error, p_labels: Array<IYoloSchema>) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Sorry, error');
            }
            return res.status(200).json(JSON.stringify(p_labels));
        });
}


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
        router.post('/upload', upload.single('file'), (req: express.Request, res: express.Response) => {
            console.log(req.file);
            var file = path.join(path.dirname(__dirname), 'uploads/', req.file.originalname);
            let is = fs.createReadStream(path.join(__dirname, '../', req.file.path));
            let ds = fs.createWriteStream(file);
            is.pipe(ds);

            is.on('end', () => {
                fs.unlinkSync(path.join(__dirname, '../', req.file.path));
            });

            return classifyImage(file, res);

            //console.log(req.file);
            //return res.send("Thank")
        });
        router.post('/upload2', upload.single('file'), (req: express.Request, res: express.Response) => {
            console.log(req.file);
            //var file = path.join(path.firname(__dirname), 'uploads/', req.file.originalname);
            const parsedFile = path.parse(req.file.originalname);

            var file = path.join('/home/monster/git/darknet/dest/', parsedFile.name + '.png');
            console.log(file);
            console.log(parsedFile);
            /*
            YoloModelSchema.find({ dirp: file })
                .select('dirp -_id')
                .limit(5)
                .exec((err: Error, p_labels: Array<IYoloSchema>) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Sorry, error');
                    }
                    return res.status(200).json(JSON.stringify(p_labels));
                });
            */
            YoloModelSchema.find({ dirp: file }, (err: Error, data: IYoloSchema) => {
                if (err)
                    console.log(err);
                return res.status(200).json(JSON.stringify([data]));
            })
        });
        router.post('/upload3', upload.single('file'), (req: express.Request, res: express.Response) => {
            console.log(req.file);
            var file = path.join(path.dirname(__dirname), 'uploads/', req.file.originalname);
            let is = fs.createReadStream(path.join(__dirname, '../', req.file.path));
            let ds = fs.createWriteStream(file);
            is.pipe(ds);

            is.on('end', () => {
                fs.unlinkSync(path.join(__dirname, '../', req.file.path));
            });

            return classifyImage2(file, res);

            //console.log(req.file);
            //return res.send("Thank")
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
