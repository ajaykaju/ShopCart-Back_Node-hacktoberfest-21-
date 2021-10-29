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
const productsFetcher = (pIds, req) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    for (const item of pIds) {
        const product = yield product_1.default.findById(item.pId, {
            _id: 1,
            title: 1,
            images: { $slice: 1 },
            actualPrice: 1,
            currentPrice: 1,
            rating: 1,
        });
        if (product)
            products.push(product);
    }
    return products;
});
const findProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const _queryExtractor = queryExtractor(req);
    let cateogryIds = [];
    const queryForFilter = () => {
        if (_queryExtractor.filters.length <= 0) {
            return {
                parent: _queryExtractor.parent,
                price: _queryExtractor.price,
            };
        }
        else {
            let filters = {};
            _queryExtractor.filters.forEach((item) => {
                if (filters[item.slice(0, item.indexOf("="))]) {
                    filters[item.slice(0, item.indexOf("="))].push(item);
                }
                else {
                    filters[item.slice(0, item.indexOf("="))] = [item];
                }
            });
            return {
                parent: _queryExtractor.parent,
                price: _queryExtractor.price,
                path: filters,
            };
        }
    };
    const _pidsToString = (pIdsRaw) => {
        const pIds = [];
        pIdsRaw.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            pIds.push(item.pId.toString());
        }));
        return pIds;
    };
    const _filteredPIds = (data, path) => __awaiter(void 0, void 0, void 0, function* () {
        let pIds = _pidsToString(data);
        let _cateogryIds = [];
        if (path) {
            for (let filter in path) {
                let _queryObject = {};
                _queryObject = {
                    pId: pIds,
                    path: path[filter],
                };
                _cateogryIds = yield categories_1.default.find(_queryObject, {
                    _id: 0,
                    pId: 1,
                });
                pIds = _pidsToString(_cateogryIds);
            }
        }
        else
            _cateogryIds = data;
        return _cateogryIds;
    });
    const queryObject = queryForFilter();
    yield categories_1.default.find({
        parent: queryObject.parent,
        price: queryObject.price,
    }, {
        _id: 0,
        pId: 1,
    })
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        cateogryIds = yield _filteredPIds(data, queryObject.path);
    }))
        .catch((e) => { });
    const idsToString = cateogryIds.map((i) => JSON.stringify(i));
    const pIds = Array.from(new Set(idsToString)).map((i) => JSON.parse(i));
    const products = yield productsFetcher(pIds, req);
    return products;
});
const queryExtractor = (req) => {
    var _a;
    let queryRaw = req.query;
    const filters = [];
    const price = {
        $gte: req.query.rangeFrom ? +req.query.rangeFrom : 0,
        $lte: req.query.rangeTo ? +req.query.rangeTo : 100000000000,
    };
    for (let qu in queryRaw) {
        if (queryRaw[qu] === null ||
            queryRaw[qu] === undefined ||
            queryRaw[qu] === "" ||
            qu === "rangeFrom" ||
            qu === "rangeTo") {
            delete queryRaw[qu];
        }
    }
    for (let qu in queryRaw) {
        if (qu !== "parent") {
            if (Array.isArray(queryRaw[qu])) {
                queryRaw[qu].forEach((item, index) => {
                    filters.push(`${qu.toLowerCase()}=${item}`);
                });
            }
            else {
                filters.push(`${qu.toLowerCase()}=${queryRaw[qu]}`);
            }
            delete queryRaw[qu];
        }
        else {
            queryRaw[qu] = (_a = queryRaw[qu]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        }
    }
    const queryObject = Object.assign({ price, filters }, queryRaw);
    return queryObject;
};
router.get("/category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.parent)
            throw new Error();
        const products = yield findProducts(req);
        res.send(products);
    }
    catch (e) {
        console.log(e);
        res.status(500).send();
    }
}));
router.get("/category/filters", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.parent)
            throw new Error();
        const allCategories = yield categories_1.default.find({
            parent: req.query.parent.toString().toLowerCase(),
        }, { _id: 0, path: 1 });
        const filters = allCategories.filter((item) => item.path.includes("="));
        const raw = [];
        filters.forEach((item) => {
            const title = item.path.slice(0, item.path.indexOf("="));
            const value = item.path.slice(item.path.indexOf("=") + 1);
            const isTitle = raw.findIndex((item) => item.title === title);
            if (isTitle >= 0) {
                if (!raw[isTitle].values.includes(value))
                    raw[isTitle].values.push(value);
            }
            else {
                raw.push({
                    title,
                    values: [value],
                });
            }
        });
        res.send(raw);
    }
    catch (e) {
        res.status(500).send();
    }
}));
exports.default = router;
