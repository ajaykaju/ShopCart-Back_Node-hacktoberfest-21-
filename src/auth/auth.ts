import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user.js";

const auth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("");
    const token: string = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET as string);
    const user: UserDocument | null = await User.findOne({
      _id: (<any>decoded)._id,
      "tokens.token": token,
    });

    if (!user) throw new Error("");

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send("Authorization Error");
  }
};

export default auth;
