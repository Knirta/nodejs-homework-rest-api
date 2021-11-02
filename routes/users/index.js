const express = require("express");
const router = express.Router();
const guard = require("../../helpers/guard");
const loginLimit = require("../../helpers/rate-limit-login");
const { validateUser, validateSubscription } = require("./validation");
const {
  registration,
  login,
  logout,
  getCurrent,
  updateSubscription,
} = require("../../controllers/users");

router.post("/signup", validateUser, registration);
router.post("/login", loginLimit, validateUser, login);
router.post("/logout", guard, logout);
router.get("/current", guard, getCurrent);
router.patch("/", guard, validateSubscription, updateSubscription);

module.exports = router;
