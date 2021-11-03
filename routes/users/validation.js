const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const patternEmail = /\S+@\S+\.\S+/;
const patternPassword = /[a-z]\d|\d[a-z]/i;

const schemaUser = Joi.object({
  password: Joi.string().pattern(new RegExp(patternPassword)).required(),
  email: Joi.string().pattern(new RegExp(patternEmail)).required(),
  subscription: Joi.string().valid("starter", "pro", "business").optional(),
});

const schemaSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `Field ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateUser = async (req, res, next) => {
  return await validate(schemaUser, req.body, res, next);
};

module.exports.validateSubscription = async (req, res, next) => {
  return await validate(schemaSubscription, req.body, res, next);
};
