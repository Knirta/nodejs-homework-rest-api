const Contact = require("../repository");

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.listContacts();
    res.status(200).json({ status: "success", code: 200, data: { contacts } });
  } catch (err) {
    next(err);
  }
};

const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.getContactById(contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

const saveContact = async (req, res, next) => {
  try {
    const newContact = await Contact.addContact(req.body);
    res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (err) {
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.removeContact(contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: { message: "Contact deleted", contact },
      });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.updateContact(contactId, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, message: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

const updateStatusFavoriteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.updateContact(contactId, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, message: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContacts,
  getContact,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
};
