import {AppLogger} from "../common/logging";
import {ApplicationError} from "../common/application-error";
import {DUser, IUser} from "../models/user-model";
import User from "../schemas/user-schema";
import {StringOrObjectId} from "../common/util";

export namespace UserDao {

    export async function getUserByEmail(email: string): Promise<IUser | null> {
        let user = await User.findOne({email: email});
        AppLogger.info(`Got user for email, userID: ${user ? user._id : "None"}`);
        return user;
    }

    export async function getUserById(id: StringOrObjectId): Promise<IUser> {
        let user = await User.findById(id).populate('photo');
        if (!user) {
            throw new ApplicationError("User not found for Id: " + id);
        }

        AppLogger.info(`Got user for id, userID: ${user._id}`);
        user.lastLogin = new Date();
        await user.save();
        return user;
    }

    export async function updateUser(id: StringOrObjectId, data: Partial<DUser>): Promise<IUser | null> {
        const password = data.password;
        delete data.password;
        let user = await User.findByIdAndUpdate(id, {$set: data}, {new: true}).populate('photo');
        if (password && user) {
            user.password = password;
            user = await user.save();
        }
        
        AppLogger.info(`Updated user by ID ${id}`);
        return user;
    }

    export async function authenticateUser(email: string, password: string): Promise<string> {
        const user = await getUserByEmail(email);
        if (user) {
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                throw new ApplicationError('Incorrect email/password combination!');
            }

            return user.createAccessToken();
        } else {
            throw new ApplicationError('User not found in the system!');
        }
    }
}
