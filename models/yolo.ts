import * as mongoose from 'mongoose';

interface IYoloPredict {
    name?: string
}

export interface IYoloSchema extends mongoose.Document {
    dir: string,
    dirp: string,
    predicted: Array<IYoloPredict>
}

const YoloSchema: mongoose.Schema = new mongoose.Schema({
    dir: string,
    dirp: string,
    predicted: [mongoose.Schema.Mixed]
});

export const YoloModelSchema = mongoose.model<IYoloSchema>('yolo', YoloSchema);
