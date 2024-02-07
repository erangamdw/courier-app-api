import * as mongoose from "mongoose";
import {Role} from "../models/user-model";
import User, {UserSchemaOptions} from "./user-schema";
import {IAdmin} from "../models/admin-model";


export const Admin = User.discriminator<IAdmin>('Admin',
    new mongoose.Schema({}, UserSchemaOptions), Role.SUPER_ADMIN);

export default Admin;
