import Router from "express";
import { generateProducts } from "../utils/generate.js";

const mockingRouter = Router();

mockingRouter.get("/", (req, res) => {
  const products = [];
  for (let i = 0; i <= 100; i++) {
    products.push(generateProducts());
  }
  res.json(products);
});

export { mockingRouter };
