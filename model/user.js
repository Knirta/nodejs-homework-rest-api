const { Schema, model } = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { subscription } = require("../config/constant");
const SALT_FACTOR = 6;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
        const re = /[a-z]\d|\d[a-z]/i;
        return re.test(String(value)) && value.length > 6;
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: {
        values: [subscription.STARTER, subscription.PRO, subscription.BUSINESS],
        message: "Not allowed subscription",
      },
      default: subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250" }, true);
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;
