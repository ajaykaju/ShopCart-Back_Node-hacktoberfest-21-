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
const user_js_1 = __importDefault(require("../models/user.js"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.header("Authorization"))
            throw new Error("");
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        const user = yield user_js_1.default.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!user)
            throw new Error("");
        req.user = user;
        req.token = token;
        next();
    }
    catch (e) {
        res.status(401).send("Authorization Error");
    }
});
exports.default = auth;
