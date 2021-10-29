import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user";

const verify: RequestHandler = async (req, res, next) => {
  try {
    if (!req.query.token) throw new Error();
    const decoded: string | object = await jwt.verify(
      req.query.token.toString(),
      process.env.TOKEN_SECRET as string
    );

    const user: UserDocument | null = await User.findOne({
      _id: (<any>decoded)._id,
      email: (<any>decoded).email,
    });

    if (!user) throw new Error();

    if (
      user.activeStatus.activateLink !== req.query.token ||
      user.activeStatus.active
    ) {
      res.redirect(`${process.env.FRONT_END_URL}/signup`);
    } else {
      req.user = user;

      next();
    }
  } catch (e) {
    res.redirect(`${process.env.FRONT_END_URL}/signup`);
  }
};

export default verify;
