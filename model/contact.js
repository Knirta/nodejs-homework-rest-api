const { Schema, model } = require("mongoose");
const { validContactInfo } = require("../config/constant");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      min: validContactInfo.MIN_NAME_LENGTH,
      max: validContactInfo.MAX_NAME_LENGTH,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
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

contactSchema.path("phone").validate(function (value) {
  const re = new RegExp("\\(\\d{3}\\) \\d{3}-\\d{4}");
  return re.test(String(value));
});

const Contact = model("contact", contactSchema);

module.exports = Contact;
