const Joi = require("joi");

const patternId = "^[A-Za-z0-9_]+$";

const schemaId = Joi.object({
  contactId: Joi.string().pattern(new RegExp(patternId)).length(21).required(),
});

const patternPhone = "\\(\\d{3}\\) \\d{3}-\\d{4}";

const schemaContact = Joi.object({
  name: Joi.string().alphanum().min(1).max(20).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string().pattern(new RegExp(patternPhone)).required(),
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

module.exports.validateId = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};
