const jwt = require("jsonwebtoken");
const path = require("path");
const Users = require("../repository/users");
const mkdirp = require("mkdirp");
const { httpCode } = require("../config/constant");
const { CustomError } = require("../helpers/custom-error");
const UploadService = require("../services/file-upload");
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
        avatarUrl: newUser.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user?.isValidPassword(password);
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

const uploadAvatar = async (req, res, next) => {
  const file = req.file;
  const id = String(req.user._id);
  const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
  const destination = path.join("public", AVATAR_OF_USERS, id);
  await mkdirp(destination);
  const uploadService = new UploadService(destination);
  const avatarUrl = await uploadService.save(file, id);
  await Users.updateAvatar(id, avatarUrl);

  return res.status(httpCode.OK).json({
    status: "success",
    code: httpCode.OK,
    data: { avatarUrl },
  });
};

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  updateSubscription,
  uploadAvatar,
};
