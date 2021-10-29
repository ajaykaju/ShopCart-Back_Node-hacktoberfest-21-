import express from "express";
import "./db/mongoose.js";
import userRoute from "./routers/user.js";
import productRoute from "./routers/product.js";
import categoryRoute from "./routers/categories.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(userRoute);
app.use(productRoute);
app.use(categoryRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
