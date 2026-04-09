const redis = require("../redis");
const cacheMiddleware = async (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }
  try {
    const cacheKey = `cache:${req.originalUrl}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.header("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.setEx(cacheKey, 60, JSON.stringify(body));
      res.header("X-Cache", "MISS");
      return originalJson(body);
    };
    next();
  } catch (error) {
    console.error(`Cache Middleware Error : ${error}`);
    next();
  }
};
module.exports = cacheMiddleware;
