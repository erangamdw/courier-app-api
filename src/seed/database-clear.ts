import User from "../schemas/user-schema";
import Blogger from "../schemas/blogger-schema";

export default async function databaseClear() {
    await User.deleteMany({});
    await Blogger.deleteMany({});
}
