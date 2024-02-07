import * as mongoose from "mongoose";
import { Types } from "mongoose";

export interface DUpload {
    type: string;
    category: string;
    path: string;
    name?: boolean;
    isUrl?: boolean;
    notes?: boolean;
    url?: string;
    extension?: string;
    originalName?: string;
    fileSize?: number;
    userId?: Types.ObjectId;
}

export type IUpload = DUpload & mongoose.Document;
