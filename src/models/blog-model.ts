import * as mongoose from "mongoose";
import {ObjectIdOr, StringOrObjectId} from "../common/util";
import {IUpload} from "./upload-model";
import {IUser} from "./user-model";
import {ICategory} from "./category-model";

export enum BlogStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

interface CommonAttributes {
    title: string;
    post: string;
    category: string;
    isValied: boolean;
    extension?: string;
    originalName?: string;
}

export interface DBlog extends CommonAttributes {
    _id?: StringOrObjectId;
    createdBy: StringOrObjectId;
    uploads?: StringOrObjectId[];
}

class StringOr<T> {
}

export interface IBlog extends CommonAttributes, mongoose.Document {
    createdBy: ObjectIdOr<IUser>;
    uploads: ObjectIdOr<IUpload>[];
    status: BlogStatus;
}