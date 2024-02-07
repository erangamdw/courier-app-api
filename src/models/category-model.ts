import * as mongoose from "mongoose";
import {ObjectIdOr, StringOrObjectId} from "../common/util";

interface CommonAttributes {
    category: string;
    note?: string;
    isValid?: boolean;
}

export interface DCategory extends CommonAttributes {
    _id?: StringOrObjectId;
}

export interface ICategory extends CommonAttributes, mongoose.Document {
    usage?: number;
}
