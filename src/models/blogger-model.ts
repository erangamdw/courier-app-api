import {DUser, IUser} from "./user-model";
import {ObjectIdOr} from "../common/util";

interface CommonAttributes {
    phone?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
}

export interface DBlogger extends CommonAttributes, DUser {

}

export interface IBlogger extends CommonAttributes, IUser {

}
