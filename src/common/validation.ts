import { check } from "express-validator";
import { Role } from "../models/userModels";
import { Types } from "mongoose";
export const Validation = {
  // Validation each fields usinng express validator
  email: () =>
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address"),
  password: () =>
    check("password")
      .isString()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 16 })
      .withMessage(
        "Password must be at least 6 chars long & not more than 40 chars long!"
      )
      .not()
      .isIn(["123", "password", "god", "abc"])
      .withMessage("Do not use a common word as the password")
      .matches(/\d/)
      .withMessage("Password must contain a number!"),
  role: (role: Role) =>
    check("role").equals(role).withMessage("Unauthorized user role!"),
  noPermissions: () => check("permissions").not().exists(),
  name: () =>
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required!")
      .isString()
      .isLength({ max: 1000 })
      .withMessage("Name field should not be more than 1000 chars long!"),
  objectId: (key: string = "_id") =>
    check(key)
      .not()
      .isEmpty()
      .withMessage(`${key} cannot be empty`)
      .custom((v) => isObjectId(v))
      .withMessage(`${key} is not a valid mongoDb objectID`),
};
export function isObjectId(v: string): boolean {
  return Types.ObjectId.isValid(v) && new Types.ObjectId(v).toHexString() === v;
}
