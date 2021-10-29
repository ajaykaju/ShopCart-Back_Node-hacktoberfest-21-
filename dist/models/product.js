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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    parent: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    categories: {
        type: [
            {
                type: String,
                trim: true,
            },
        ],
        validate: (v) => Array.isArray(v) && v.length > 0,
    },
    rating: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    images: {
        type: [
            {
                type: String,
                trim: true,
            },
        ],
        validate: (v) => Array.isArray(v) && v.length > 0,
    },
    currentPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    actualPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    briefDescription: {
        type: String,
        trim: true,
        required: true,
    },
    availableOffers: [
        {
            title: {
                type: String,
                default: "",
            },
            offer: {
                type: String,
                default: "",
            },
        },
    ],
    warranty: {
        type: String,
        required: true,
        trim: true,
    },
    sellerAndPolicies: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        policies: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            validate: (v) => Array.isArray(v) && v.length > 0,
        },
    },
    highlights: {
        type: [
            {
                type: String,
                trim: true,
            },
        ],
        validate: (v) => Array.isArray(v) && v.length > 0,
    },
    descriptions: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                required: true,
                trim: true,
            },
        },
    ],
    specifications: [
        {
            name: {
                type: String,
                trim: true,
                required: true,
            },
            specification: [
                {
                    title: {
                        type: String,
                        trim: true,
                        required: true,
                    },
                    content: {
                        type: String,
                        trim: true,
                        required: true,
                    },
                },
            ],
        },
    ],
    manufactureAndOtherInfo: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            content: {
                type: String,
                required: true,
                trim: true,
            },
        },
    ],
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
