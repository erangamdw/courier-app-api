import {SchemaOptions} from "mongoose";

export const schemaOptions: SchemaOptions = {
    _id: true,
    id: false,
    toJSON: {getters: true},
    timestamps: false,
    skipVersioning: true
};

export const uploadPath = process.env.UPLOAD_PATH;
