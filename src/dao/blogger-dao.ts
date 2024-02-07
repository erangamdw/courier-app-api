import {DUser} from "../models/user-model";
import {AppLogger} from "../common/logging";
import {UserDao} from "./user-dao";
import Blogger from "../schemas/blogger-schema";
import {DBlogger, IBlogger} from "../models/blogger-model";

export namespace BloggerDao{

    export async function getBloggerByEmail(email: string): Promise<IBlogger | null> {
        let  blogger = await Blogger.findOne({email: email});
        AppLogger.info(`Got Blogger for email, userID: ${blogger ? blogger._id : "None"}`);
        return blogger;
    }

    export async function createBlogger(data: DUser & Partial<DBlogger>): Promise<string> {
        console.log(data);
        const iBlogger = new Blogger(data);
        let blogger = await iBlogger.save();
        AppLogger.info(`Create profile for Blogger ID: ${blogger._id}`);
        return await UserDao.authenticateUser(data.email, data.password);
    }
}
