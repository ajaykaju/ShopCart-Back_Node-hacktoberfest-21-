"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongoose.js");
const user_js_1 = __importDefault(require("./routers/user.js"));
const product_js_1 = __importDefault(require("./routers/product.js"));
const categories_js_1 = __importDefault(require("./routers/categories.js"));
const app = express_1.default();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(user_js_1.default);
app.use(product_js_1.default);
app.use(categories_js_1.default);
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
