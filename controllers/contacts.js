const Contacts = require("../repository/contacts");
const { httpCode } = require("../config/constant");
const { CustomError } = require("../helpers/custom-error");

const getContacts = async (req, res) => {
  const userId = req.user._id;
  const data = await Contacts.listContacts(userId, req.query);
  res
    .status(httpCode.OK)
    .json({ status: "success", code: httpCode.OK, data: { ...data } });
};

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await Contacts.getContactById(contactId, userId);
  if (contact) {
    return res
      .status(httpCode.OK)
      .json({ status: "success", code: httpCode.OK, data: { contact } });
  }
  throw new CustomError(404, "Not found");
};

const saveContact = async (req, res) => {
  const userId = req.user._id;
  const newContact = await Contacts.addContact({
    ...req.body,
    owner: userId,
  });
  res.status(httpCode.CREATED).json({
    status: "success",
    code: httpCode.CREATED,
    data: { newContact },
  });
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await Contacts.removeContact(contactId, userId);
  if (contact) {
    return res.status(httpCode.OK).json({
      status: "success",
      code: httpCode.OK,
      message: { message: "Contact deleted", contact },
    });
  }
  throw new CustomError(404, "Not found");
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await Contacts.updateContact(contactId, req.body, userId);
  if (contact) {
    return res
      .status(httpCode.OK)
      .json({ status: "success", code: httpCode.OK, data: { contact } });
  }
  throw new CustomError(404, "Not found");
};

const updateStatusFavoriteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await Contacts.updateContact(contactId, req.body, userId);
  if (contact) {
    return res
      .status(httpCode.OK)
      .json({ status: "success", code: httpCode.OK, data: { contact } });
  }
  throw new CustomError(404, "Not found");
};

module.exports = {
  getContacts,
  getContact,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
};
