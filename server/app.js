// IMPORTS -
const express = require("express");
const { getProductsPromise, getProductsDetails } = require("./api/products");
const redis = require("./config/config");
const redisKeys = require("./constants/keys");
const getCachedData = require("./middleware/redis");
const app = express();

// HOME -
app.get("/", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const key = `${clientIp} - ${redisKeys.CLIENT_REQUEST_COUNT}`;
  const reqCount = await redis.incr(key);

  // if (reqCount === 1) {
  //   await redis.expire(key, 60);
  // }

  const ttl = await redis.ttl(key);

  if (reqCount > 10) {
    res.status(429).send(`Too many requests. Try again in ${ttl} seconds`);  
  }

  res
    .status(200)
    .send(`Welcome to the home page. You have made ${reqCount} requests`);
});

// PRODUCTS -
app.get("/products", getCachedData(redisKeys.PRODUCTS), async (_req, res) => {
  // REPLACED WITH MIDDLEWARE -
  // let products = await redis.get(redisKeys.PRODUCTS);

  // if (products) {
  //   console.log("Fetching products from Redis");

  //   return res.status(200).json({
  //     products: JSON.parse(products),
  //   });
  // }

  const products = await getProductsPromise();
  await redis.set(redisKeys.PRODUCTS, JSON.stringify(products));
  // await redis.setex(redisKeys.PRODUCTS, 20, JSON.stringify(products.products))
  res.status(200).json({
    products,
  });
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  let key = `${redisKeys.PRODUCT_DETAILS}-${id}`;
  let product = await redis.get(key);

  if (product) {
    return res.status(200).json({
      product: JSON.parse(product),
    });
  }

  product = await getProductsDetails(id);
  await redis.set(key, JSON.stringify(product));

  res.status(200).json({
    product,
  });
});

app.get("/order/:id", async (req, res) => {
  const productId = req.params.id;

  // MUTATION TO DATABASE HERE -
  // > CREATING NEW ORDER IN DB
  // > REDUCING PRODUCT STOCK IN DB
  // > INVALIDATE PRODUCT DETAILS CACHE

  const key = `${redisKeys.PRODUCT_DETAILS}-${productId}`;
  await redis.del(key);
  res.status(200).json({
    message: `Order placed for product id: ${productId}`,
  });
});

// SERVER -
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
