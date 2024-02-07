import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {Role} from "../models/user-model";
import User, {UserSchemaOptions} from "./user-schema";
import {IBlogger} from "../models/blogger-model";

export const bloggerSchema = new mongoose.Schema({
    phone: {
        type: Schema.Types.String,
        required: false,
    },
    website: {
        type: Schema.Types.String,
        required: false,
    },
    facebook: {
        type: Schema.Types.String,
        required: false,
    },
    twitter: {
        type: Schema.Types.String,
        required: false,
    },
    instagram: {
        type: Schema.Types.String,
        required: false,
    }
}, UserSchemaOptions);


export const Blogger = User.discriminator<IBlogger>('Blogger', bloggerSchema, Role.BLOGGER);

export default Blogger;
