const rateLimit = require("express-rate-limit");
const { httpCode } = require("../config/constant");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res
      .status(httpCode.TOO_MANY_REQUESTS)
      .json({
        status: "error",
        code: httpCode.TOO_MANY_REQUESTS,
        message: "Too many requests",
      });
  },
});

module.exports = limiter;
