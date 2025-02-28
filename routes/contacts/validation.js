const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { validContactInfo } = require("../../config/constant");

const schemaId = Joi.object({
  contactId: Joi.objectId().required(),
});

const patternPhone = "\\(\\d{3}\\) \\d{3}-\\d{4}";

const schemaContact = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(validContactInfo.MIN_NAME_LENGTH)
    .max(validContactInfo.MAX_NAME_LENGTH)
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string().pattern(new RegExp(patternPhone)).required(),
  favorite: Joi.boolean().optional(),
});

const schemaStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
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

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusContact, req.body, res, next);
};
