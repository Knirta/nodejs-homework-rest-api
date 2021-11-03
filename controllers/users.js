const jwt = require("jsonwebtoken");
const Users = require("../repository/users");
const { httpCode } = require("../config/constant");
const { CustomError } = require("../helpers/custom-error");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const registration = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    res.status(httpCode.CONFLICT).json({
      status: "error",
      code: httpCode.CONFLICT,
      message: "Email in use",
    });
  }
  try {
    const newUser = await Users.create({ email, password, subscription });
    res.status(httpCode.CREATED).json({
      status: "success",
      code: httpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = user ? await user.isValidPassword(password) : false;
  if (!user || !isValidPassword) {
    return res.status(httpCode.UNAUTHORIZED).json({
      status: "error",
      code: httpCode.UNAUTHORIZED,
      message: "Email or password is wrong",
    });
  }
  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await Users.updateToken(id, token);
  return res.status(httpCode.OK).json({
    status: "success",
    code: httpCode.OK,
    data: {
      token,
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(httpCode.NO_CONTENT).json({});
};

const getCurrent = async (req, res, next) => {
  const { email, subscription, createdAt, updatedAt } = req.user;
  return res.status(httpCode.OK).json({
    status: "success",
    code: httpCode.OK,
    data: {
      user: { email, subscription, createdAt, updatedAt },
    },
  });
};

const updateSubscription = async (req, res, next) => {
  const id = req.user._id;
  const user = await Users.updateSubscription(id, req.body);
  if (user) {
    return res
      .status(httpCode.OK)
      .json({ status: "success", code: httpCode.OK, data: { user } });
  }
  throw new CustomError(404, "Not found");
};

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  updateSubscription,
};
