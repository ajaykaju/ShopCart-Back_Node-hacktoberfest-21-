import { Router, Request, Response } from "express";
import Categories, { CategoryDocument } from "../models/categories";
import Product, { ProductDocument } from "../models/product";

const router: Router = Router();

router.post("/product", async (req: Request, res: Response) => {
  const product: ProductDocument = new Product(req.body);
  try {
    const _product = await product.save();

    _product.categories.forEach(async (category) => {
      const item: CategoryDocument = new Categories({
        pId: product._id,
        title: product.title,
        parent: product.parent,
        path: category,
        price: product.currentPrice,
      });

      await item.save();
    });

    res.status(201).send(_product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/product", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById({ _id: req.query.id });
    if (product) res.send(product);
    else throw new Error();
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    if (products) res.send(products);
    else throw new Error();
  } catch (e) {
    res.status(404).send();
  }
});

export default router;
