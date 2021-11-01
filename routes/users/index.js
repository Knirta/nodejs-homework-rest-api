const express = require("express");
const router = express.Router();
const guard = require("../../helpers/guard");
const { registration, login, logout } = require("../../controllers/users");

router.post("/signup", registration);
router.post("/login", login);
router.post("/logout", guard, logout);

module.exports = router;
