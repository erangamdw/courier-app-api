import mongoose from "mongoose";
import {Schema} from "mongoose";
import {IUpload} from "../models/upload-model";


const schemaOptions: mongoose.SchemaOptions = {
    _id: true,
    id: false,
    timestamps: true,
    skipVersioning: true,
    strict: false,
    toJSON: {
        virtuals: true,
        // transform: (doc: any, ret: any) => {
        //     delete ret.path;
        //     delete ret.isUrl;
        // }
    },
    toObject: { virtuals: true }
};

const uploadSchema = new mongoose.Schema({
    type: {
        type: Schema.Types.String,
        required: true,
    },
    category: {
        type: Schema.Types.String,
        required: false,
    },
    path: {
        type: Schema.Types.String,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: false,
    },
    originalName: {
        type: Schema.Types.String,
        required: false,
    },
    extension: {
        type: Schema.Types.String,
        required: false,
    },
    isUrl: {
        type: Schema.Types.Boolean,
        required: true,
        default: false
    },
    notes: {
        type: Schema.Types.String,
        required: false,
    },
}, schemaOptions);

uploadSchema.virtual('url').get(function (this: { isUrl: boolean, path: string, _id: string, originalName: string}) {
    return process.env.FILE_ACCESS_URL + '/' + this._id + '/' + this.originalName;
});



const Upload = mongoose.model<IUpload>('Upload', uploadSchema);
export default Upload;
