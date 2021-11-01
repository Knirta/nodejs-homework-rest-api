const express = require("express");

const guard = require("../../helpers/guard");

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

router.get("/", guard, getContacts);

router.get("/:contactId", guard, validateId, getContact);

router.post("/", guard, validateContact, saveContact);

router.delete("/:contactId", guard, validateId, removeContact);

router.put("/:contactId", guard, [validateId, validateContact], updateContact);

router.patch(
  "/:contactId/favorite",
  guard,
  [validateId, validateStatusContact],
  updateStatusFavoriteContact
);

module.exports = router;
