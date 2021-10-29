import { Router, Request, Response } from "express";
import Categories from "../models/categories";
import Product, { ProductDocument } from "../models/product";

const router: Router = Router();

const productsFetcher: Function = async (
  pIds: [{ pId: string }],
  req: Request
) => {
  let products: ProductDocument[] = [];
  for (const item of pIds) {
    const product: ProductDocument | null = await Product.findById(item.pId, {
      _id: 1,
      title: 1,
      images: { $slice: 1 },
      actualPrice: 1,
      currentPrice: 1,
      rating: 1,
    });
    if (product) products.push(product);
  }
  return products;
};

const findProducts: Function = async (req: Request) => {
  const _queryExtractor = queryExtractor(req);

  type idType = { pId: string };

  let cateogryIds: idType[] = [];

  const queryForFilter = () => {
    if (_queryExtractor.filters.length <= 0) {
      return {
        parent: _queryExtractor.parent,
        price: _queryExtractor.price,
      };
    } else {
      let filters: { [key: string]: string[] } = {};

      (<string[]>_queryExtractor.filters).forEach((item) => {
        if (filters[item.slice(0, item.indexOf("="))]) {
          filters[item.slice(0, item.indexOf("="))].push(item);
        } else {
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

  const _pidsToString = (pIdsRaw: idType[]) => {
    const pIds: string[] = [];
    pIdsRaw.forEach(async (item) => {
      pIds.push(item.pId.toString());
    });
    return pIds;
  };

  const _filteredPIds = async (
    data: idType[],
    path: { [key: string]: string[] } | undefined
  ) => {
    let pIds = _pidsToString(data);
    let _cateogryIds: idType[] = [];
    if (path) {
      for (let filter in path) {
        let _queryObject = {};
        _queryObject = {
          pId: pIds,
          path: path[filter],
        };

        _cateogryIds = await Categories.find(_queryObject, {
          _id: 0,
          pId: 1,
        });

        pIds = _pidsToString(_cateogryIds);
      }
    } else _cateogryIds = data;

    return _cateogryIds;
  };

  const queryObject: {
    parent: string;
    price: number;
    path?: { [key: string]: string[] };
  } = queryForFilter();

  await Categories.find(
    {
      parent: queryObject.parent,
      price: queryObject.price,
    },
    {
      _id: 0,
      pId: 1,
    }
  )
    .then(async (data) => {
      cateogryIds = await _filteredPIds(data, queryObject.path);
    })
    .catch((e) => {});

  const idsToString = cateogryIds.map((i) => JSON.stringify(i));

  const pIds = Array.from(new Set(idsToString)).map((i) => JSON.parse(i));

  const products = await productsFetcher(pIds, req);

  return products;
};

const queryExtractor: Function = (req: Request) => {
  let queryRaw = req.query;

  const filters: string[] = [];

  const price = {
    $gte: req.query.rangeFrom ? +req.query.rangeFrom : 0,
    $lte: req.query.rangeTo ? +req.query.rangeTo : 100000000000,
  };

  for (let qu in queryRaw) {
    if (
      queryRaw[qu] === null ||
      queryRaw[qu] === undefined ||
      queryRaw[qu] === "" ||
      qu === "rangeFrom" ||
      qu === "rangeTo"
    ) {
      delete queryRaw[qu];
    }
  }

  for (let qu in queryRaw) {
    if (qu !== "parent") {
      if (Array.isArray(queryRaw[qu])) {
        (<string[]>queryRaw[qu]).forEach((item, index) => {
          filters.push(`${qu.toLowerCase()}=${item}`);
        });
      } else {
        filters.push(`${qu.toLowerCase()}=${queryRaw[qu]}`);
      }
      delete queryRaw[qu];
    } else {
      queryRaw[qu] = queryRaw[qu]?.toString().toLowerCase();
    }
  }

  const queryObject = { price, filters, ...queryRaw };

  return queryObject;
};

router.get("/category", async (req: Request, res: Response) => {
  try {
    if (!req.query.parent) throw new Error();
    const products = await findProducts(req);

    res.send(products);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/category/filters", async (req: Request, res: Response) => {
  try {
    if (!req.query.parent) throw new Error();
    const allCategories = await Categories.find(
      {
        parent: req.query.parent.toString().toLowerCase(),
      },
      { _id: 0, path: 1 }
    );
    const filters = allCategories.filter((item) => item.path.includes("="));
    type filterType = {
      title: string;
      values: string[];
    };
    const raw: filterType[] = [];
    filters.forEach((item) => {
      const title = item.path.slice(0, item.path.indexOf("="));
      const value = item.path.slice(item.path.indexOf("=") + 1);
      const isTitle = raw.findIndex((item) => item.title === title);
      if (isTitle >= 0) {
        if (!raw[isTitle].values.includes(value))
          raw[isTitle].values.push(value);
      } else {
        raw.push({
          title,
          values: [value],
        });
      }
    });

    res.send(raw);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
