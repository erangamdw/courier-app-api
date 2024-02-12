import mongoose, { Schema } from "mongoose";
import { IUser, Permission, Role } from "../models/userModels";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { checkPermissions } from "../middleware/verifyPermission";
import { Express } from "../global";

// USER SCHEMA
export const userSchema = new mongoose.Schema(
  {
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      required: true,
    },
    permissions: [
      {
        type: Schema.Types.String,
        required: true,
        default: [],
      },
    ],
    name: {
      type: Schema.Types.String,
      required: true,
    },
    lastLogin: {
      type: Schema.Types.Date,
      required: false,
    },
    photo: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// HASHED THE PASSWORD BEFORE SAVING (USING MIDDLEWARE)
userSchema.pre("save", async function (next) {
  const user: any = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});
// CREATE THE TOKEN USING JSONWEBTOKEN
userSchema.methods.createAccessToken = function (expiresIn: string = "24h") {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY as Secret, {
    expiresIn: expiresIn,
  });
};

//COMPARE THE USER ENTERED PASSWORD WITH DATABASE SAVED PASSWORD
userSchema.methods.comparePassword = function (
  password: any
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      return resolve(isMatch);
    });
  });
};

// CHECK THE USER PERMISSIONS
userSchema.methods.hasPermission = function (
  ...permissions: Permission[]
): boolean {
  const [success] = checkPermissions(this as Express.User, permissions);
  return success;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
