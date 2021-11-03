const { httpCode } = require("../config/constant");

const role = (subscription) => (req, res, next) => {
  const contactSubscription = req.user.subscription;
  if (contactSubscription !== subscription) {
    return res.status(httpCode.FORBIDDEN).json({
      status: "error",
      code: httpCode.FORBIDDEN,
      message: "Access denied",
    });
  }
  return next();
};

module.exports = role;
