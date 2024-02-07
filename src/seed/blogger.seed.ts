import {DUser, Role} from "../models/user-model";
import {BloggerDao} from "../dao/blogger-dao";
import {DBlogger} from "../models/blogger-model";

export const bloggerEmail = `supperblogger@tests.com`;

export default async function seedBlogger() {
    const supperBlogger: DBlogger = {
        password: "111111",
        name: `Code Writer`,
        email: bloggerEmail,
        role: Role.BLOGGER,
        lastLogin: new Date()
    };
    const supperBlogger_ = await createAdmin(supperBlogger);

    const blogger: DBlogger = {
        password: "111111",
        name: `Blogger`,
        email: 'blogger@test.com',
        role: Role.BLOGGER,
        lastLogin: new Date()
    };

    const blogger_ = await createAdmin(blogger);
    return [supperBlogger_, blogger_];
}

async function createAdmin(blogger: DBlogger) {
    const existingUser = await BloggerDao.getBloggerByEmail(blogger.email);
    if (existingUser) {
        return existingUser;
    }
    return await BloggerDao.createBlogger(blogger);
}
