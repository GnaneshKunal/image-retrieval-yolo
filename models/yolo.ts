import * as mongoose from 'mongoose';

interface IYoloPredict {
    name?: string
}

export interface IYoloSchema extends mongoose.Document {
    dir: string,
    dirp: string,
    predicted: Array<IYoloPredict>,
    labels: Array<string>
}


const YoloSchema: mongoose.Schema = new mongoose.Schema({
    dir: {
        type: String,
        unique: true
    },
    dirp: {
        type: String,
        unique: true
    },
    predicted: [String],
    labels: [String]
});



export const YoloModelSchema = mongoose.model<IYoloSchema>('yolo', YoloSchema);
