import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import User from "./user-schema";
import Upload from "./upload-schema";
import {BlogStatus, IBlog} from "../models/blog-model";
import Category from "./category-schema";

const blogSchemaOptions: mongoose.SchemaOptions = {
    _id: true,
    id: false,
    timestamps: true,
    skipVersioning: true,
    strict: false,
    toJSON: {
        getters: true,
        virtuals: true,
    },
};

export const blogSchema = new mongoose.Schema({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    post: {
        type: Schema.Types.String,
        required: true,
    },
    isValied: {
        type: Schema.Types.Boolean,
        required: true,
    },
    category: {
        type: Schema.Types.String,
        required: true,
    },
    uploads: [{
        type: Schema.Types.ObjectId,
        required: false,
        default: [],
        ref: Upload.modelName,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User.modelName
    },
    status: {
        type: Schema.Types.String,
        required: false,
        default: BlogStatus.COMPLETED   ,
    },
}, blogSchemaOptions);


const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
