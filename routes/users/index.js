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
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
} = require("../../controllers/users");
const upload = require("../../helpers/upload");
const wrapError = require("../../helpers/error-handler");

router.post("/signup", validateUser, registration);
router.post("/login", loginLimit, validateUser, login);
router.post("/logout", guard, logout);
router.get("/current", guard, getCurrent);
router.patch("/", guard, validateSubscription, updateSubscription);
router.patch("/avatars", guard, upload.single("avatar"), uploadAvatar);
router.get("/verify/:token", wrapError(verifyUser));
router.post("/verify", repeatEmailForVerifyUser);

module.exports = router;
