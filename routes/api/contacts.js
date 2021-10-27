const express = require("express");

const {
  validateId,
  validateContact,
  validateStatusContact,
} = require("./validation");

const {
  getContact,
  getContacts,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", validateId, getContact);

router.post("/", validateContact, saveContact);

router.delete("/:contactId", validateId, removeContact);

router.put("/:contactId", [validateId, validateContact], updateContact);

router.patch(
  "/:contactId/favorite",
  [validateId, validateStatusContact],
  updateStatusFavoriteContact
);

module.exports = router;
