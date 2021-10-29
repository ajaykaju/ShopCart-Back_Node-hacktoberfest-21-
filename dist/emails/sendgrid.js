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
exports.sendWelcomMail = exports.sendVerificationMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const templateVerification_1 = __importDefault(require("./templateVerification"));
const templateWelcome_1 = __importDefault(require("./templateWelcome"));
mail_1.default.setApiKey(process.env.SENDGRID_API);
const sendVerificationMail = (to, data, name, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to,
        from: "ajukodinhi@gmail.com",
        subject: "ShopCart Confirmation",
        text: "ShopCart email verification",
        html: templateVerification_1.default(name, `http://localhost:${process.env.PORT}/verify?token=${data}`),
    };
    yield mail_1.default
        .send(msg)
        .then(() => {
        callback(undefined, true);
    })
        .catch((error) => {
        callback(error, undefined);
        console.log(error);
    });
});
exports.sendVerificationMail = sendVerificationMail;
const sendWelcomMail = (to, name) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to,
        from: "ajukodinhi@gmail.com",
        subject: "ShopCart Welcome",
        text: "ShopCart Welcome Mail",
        html: templateWelcome_1.default(name, `${process.env.FRONT_END_URL}/login`),
    };
    yield mail_1.default.send(msg);
});
exports.sendWelcomMail = sendWelcomMail;
