// IMPORTS -
const redis = require("../config/config");

const getCachedData = (key) => async (req, res, next) => {
  let data = await redis.get(key);

  if (data) {
    return res.status(200).json({
      data: JSON.parse(data),
    });
  }

  next();
};

module.exports = getCachedData;