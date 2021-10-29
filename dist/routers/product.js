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
const express_1 = require("express");
const categories_1 = __importDefault(require("../models/categories"));
const product_1 = __importDefault(require("../models/product"));
const router = express_1.Router();
router.post("/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new product_1.default(req.body);
    try {
        const _product = yield product.save();
        _product.categories.forEach((category) => __awaiter(void 0, void 0, void 0, function* () {
            const item = new categories_1.default({
                pId: product._id,
                title: product.title,
                parent: product.parent,
                path: category,
                price: product.currentPrice,
            });
            yield item.save();
        }));
        res.status(201).send(_product);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.findById({ _id: req.query.id });
        if (product)
            res.send(product);
        else
            throw new Error();
    }
    catch (e) {
        res.status(404).send();
    }
}));
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find();
        if (products)
            res.send(products);
        else
            throw new Error();
    }
    catch (e) {
        res.status(404).send();
    }
}));
exports.default = router;
