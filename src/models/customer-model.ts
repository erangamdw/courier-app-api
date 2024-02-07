import {DUser, IUser} from "./user-model";
import {ObjectIdOr} from "../common/util";

interface CommonAttributes {
    phone?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    braintreeId?: string;
}

export interface DCustomer extends CommonAttributes, DUser {
    // paymentMethods?: DPaymentMethod[];
}

export interface ICustomer extends CommonAttributes, IUser {
    // paymentMethods: ObjectIdOr<IPaymentMethod>[];
    // project: ObjectIdOr<IProject>[];

}
