"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.token)
            throw new Error();
        const decoded = yield jsonwebtoken_1.default.verify(req.query.token.toString(), process.env.TOKEN_SECRET);
        const user = yield user_1.default.findOne({
            _id: decoded._id,
            email: decoded.email,
        });
        if (!user)
            throw new Error();
        if (user.activeStatus.activateLink !== req.query.token ||
            user.activeStatus.active) {
            res.redirect(`${process.env.FRONT_END_URL}/signup`);
        }
        else {
            req.user = user;
            next();
        }
    }
    catch (e) {
        res.redirect(`${process.env.FRONT_END_URL}/signup`);
    }
});
exports.default = verify;
