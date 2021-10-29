"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
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
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 7,
        validate(value) {
            if (!validator_1.default.isStrongPassword(value)) {
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
        validate(value) {
            if (!validator_1.default.isMobilePhone(value.toString())) {
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
userSchema.statics.findByCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email });
        if (!user)
            throw new Error("Unable to login");
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Unable to login");
        return user;
    });
};
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET);
        user.tokens = user.tokens.concat({ token });
        yield user.save();
        return token;
    });
};
userSchema.methods.generateVerificationToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({
            _id: user._id.toString(),
            email: user.email,
        }, process.env.TOKEN_SECRET, {
            expiresIn: "7d",
        });
        user.activeStatus.activateLink = token;
        yield user.save();
        return token;
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcryptjs_1.default.hash(user.password, 8);
        }
        next();
    });
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
