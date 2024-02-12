import mongoose from "mongoose";
import { StringOrObjectId } from "../common/utils";

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum Permission {
  MANAGE_CUSTOMERS = "MANAGE_CUSTOMERS",
  MANAGE_CONTACT_MESSAGES = "MANAGE_CONTACT_MESSAGES",
  MANAGE_SERVICE = "MANAGE_SERVICE",
  MANAGE_UPLOAD = "MANAGE_UPLOAD",
  MANAGE_PAYMENTS = "MANAGE_PAYMENTS",
  MANAGE_EMAIL_SUBSCRIPTIONS = "MANAGE_EMAIL_SUBSCRIPTIONS",
}

interface commonAttributes {
  email: string;
  password: string;
  role?: Role;
  permissions?: Permission[];
  name: string;
  lastLogin?: Date;
}

export interface DUSer extends commonAttributes {
  _id?: StringOrObjectId;
}
export interface IUser extends commonAttributes, mongoose.Document {
  createAccessToken(): string;

  comparePassword(password: string): Promise<boolean>;

  hasPermission(...permissions: Permission[]): boolean;
}
