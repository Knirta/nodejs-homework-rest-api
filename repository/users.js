const { subscription } = require("../config/constant");
const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (id, body) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  ).select({ password: 0, token: 0 });
  return result;
};

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarUrl });
};

const updateTokenVerify = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

module.exports = {
  findById,
  findByEmail,
  findUserByVerifyToken,
  create,
  updateToken,
  updateSubscription,
  updateAvatar,
  updateTokenVerify,
};
