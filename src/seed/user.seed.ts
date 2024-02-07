import {DUser, Role} from "../models/user-model";
import {AdminDao} from "../dao/admin-dao";

export const superAdminEmail = `superadmin@tests.com`;

export default async function seedUsers() {
    const superAdmin: DUser = {
        password: "111111",
        name: `Super Admin`,
        email: superAdminEmail,
        role: Role.SUPER_ADMIN,
        lastLogin: new Date()
    };
    const superAdmin_ = await createAdmin(superAdmin);
    return [superAdmin_];

    const admin: DUser = {
        password: "111111",
        name: `Admin`,
        email: 'admin@test.com',
        role: Role.ADMIN,
        lastLogin: new Date()
    };

    // const admin_ = await createAdmin(admin);
    // return [superAdmin_, admin_];
}

async function createAdmin(user: DUser) {
    const existingUser = await AdminDao.getAdminByEmail(user.email);
    if (existingUser) {
        return existingUser;
    }
    return await AdminDao.createAdmin(user);
}
