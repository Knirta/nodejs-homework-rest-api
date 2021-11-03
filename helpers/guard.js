const passport = require("passport");
require("../config/passport");
const { httpCode } = require("../config/constant");

const guard = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!user || err || token !== user.token) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: "error",
        code: httpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
