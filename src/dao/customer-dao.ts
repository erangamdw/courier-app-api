import {DUser} from "../models/user-model";
import {AppLogger} from "../common/logging";
import {UserDao} from "./user-dao";
import {DCustomer} from "../models/customer-model";
import Customer from "../schemas/customer-schema";

export namespace CustomerDao{
    export async function createCustomer(data: DUser & Partial<DCustomer>): Promise<string> {
        const iCustomer = new Customer(data);
        let customer = await iCustomer.save();
        AppLogger.info(`Create profile for user ID: ${customer._id}`);
        return await UserDao.authenticateUser(data.email, data.password);
    }
}