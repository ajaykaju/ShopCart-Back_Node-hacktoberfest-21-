import { Router, Request, Response } from "express";

import auth from "../auth/auth.js";
import verify from "../auth/verification.js";
import { sendVerificationMail, sendWelcomMail } from "../emails/sendgrid.js";
import User, { UserDocument, tokenObj } from "../models/user.js";

const router: Router = Router();

router.post("/user", async (req, res) => {
  const user: UserDocument = new User(req.body);
  try {
    await user.save();
    const token = await user.generateVerificationToken();
    await sendVerificationMail(
      user.email,
      token,
      `${user.firstName}  ${user.lastName}`,
      async (error, data) => {
        if (error) {
          await User.deleteOne({ email: user.email });
          res.status(400).send();
        }
        if (data) {
          res.status(201).send({ user });
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user: UserDocument = await User.findByCredentials(
      req.body.email.toString(),
      req.body.password.toString()
    );
    const token: string = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send();
  }
});

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/user/logout", auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token != req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/logoutAll", auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/isNewUser", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.send();
    else res.status(406).send("Email already in use!");
  } catch (e) {
    res.status(500).send(e);
  }
});

//account verification endpoint

router.get("/verify", verify, async (req: Request, res: Response) => {
  try {
    const user: UserDocument = req.user;
    user.activeStatus.active = true;
    user.activeStatus.activateLink = "";
    await user.save();
    await sendWelcomMail(user.email, `${user.firstName}  ${user.lastName}`);
    res.redirect(`${process.env.FRONT_END_URL}/login`); // local server
  } catch (e) {
    res.send(500).send();
  }
});

export default router;
