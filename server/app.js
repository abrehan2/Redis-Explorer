// IMPORTS -
const express = require("express");
const { getProductsPromise } = require("./api/products");
const redis = require("./config/config");
const redisKeys = require("./constants/keys");
const app = express();

// HOME -
app.get("/", (_req, res) => {
  res.send("Hello World");
});

// PRODUCTS -
app.get("/products", async (_req, res) => {

let products = await redis.get(redisKeys.PRODUCTS);

  if (products) {
    console.log("Fetching products from Redis");
    

   return res.status(200).json({
      products: JSON.parse(products),
    });
  }

  products = await getProductsPromise();
  // await redis.set(redisKeys.PRODUCTS, JSON.stringify(products.products))
  await redis.setex(redisKeys.PRODUCTS, 20, JSON.stringify(products.products))
  res.status(200).json({
    products,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
