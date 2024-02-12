import { IUser, Permission, Role } from "../models/userModels";
import { Express } from "../global";

export const checkPermissions = (
  user: Express.User,
  permission: Permission[]
): [boolean, string] => {
  switch (user.role) {
    case Role.ADMIN:
      if (permission) {
        if (
          !user.permissions.find((p: any) => permission.includes(<Permission>p))
        ) {
          return [false, "Permission denied"];
        }
      }
      break;
    case Role.CUSTOMER:
      return [false, "Customers don't have special permissions"];

    default:
      return [false, "Unsupported user role"];
  }

  return [true, ""];
};
