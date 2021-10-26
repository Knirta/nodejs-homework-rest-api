const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model");
const { validateId, validateContact } = require("./validation");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ status: "success", code: 200, data: { contacts } });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", validateId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
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
});

router.post("/", validateContact, async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", validateId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
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
});

router.put(
  "/:contactId",
  validateId,
  validateContact,
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await updateContact(contactId, req.body);
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
  }
);

module.exports = router;
