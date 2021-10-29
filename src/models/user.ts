import mongoose, { Schema, Document, Model } from "mongoose";

import Validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type tokenObj = {
  token: string;
};

export type activeStatus = {
  active: boolean;
  activateLink: string;
};

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: Date;
  phoneNumber: number;
  tokens: tokenObj[];
  activeStatus: activeStatus;
  generateAuthToken(): any;
  generateVerificationToken(): any;
}

export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): UserDocument;
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 21,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 21,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value: any) {
      if (!Validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate(value: any) {
      if (!Validator.isStrongPassword(value)) {
        throw new Error("Password is invalid");
      }
    },
  },
  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    trim: true,
    validate(value: any) {
      if (!Validator.isMobilePhone(value.toString())) {
        throw new Error("Enter a valid mobile number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  activeStatus: {
    active: {
      type: Boolean,
      default: false,
    },
    activateLink: {
      type: String,
      default: "",
    },
  },
});

userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const user: UserDocument | null = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");
  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user: UserDocument = this as UserDocument;
  const token: string = jwt.sign(
    { _id: user._id.toString() },
    process.env!.TOKEN_SECRET as string
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.generateVerificationToken = async function () {
  const user: UserDocument = this as UserDocument;
  const token: string = jwt.sign(
    {
      _id: user._id.toString(),
      email: user.email,
    },
    process.env!.TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  user.activeStatus.activateLink = token;
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user: UserDocument = this as UserDocument;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
