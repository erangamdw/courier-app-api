import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {Role} from "../models/user-model";
import User, {UserSchemaOptions} from "./user-schema";
import {ICustomer} from "../models/customer-model";

export const customerSchema = new mongoose.Schema({
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


export const Customer = User.discriminator<ICustomer>('Customer', customerSchema, Role.CUSTOMER);

export default Customer;
