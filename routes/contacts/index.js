const express = require("express");

const guard = require("../../helpers/guard");

const {
  validateId,
  validateContact,
  validateStatusContact,
} = require("./validation");

const wrapError = require("../../helpers/error-handler");

const {
  getContact,
  getContacts,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
} = require("../../controllers/contacts");

const role = require("../../helpers/role");
const { subscription } = require("../../config/constant");

const router = express.Router();

router.get("/", guard, wrapError(getContacts));

router.get(
  "/business",
  guard,
  role(subscription.BUSINESS),
  wrapError((req, res, next) =>
    res.json({ status: "success", code: 200, message: "Only for business" })
  )
);

router.get("/:contactId", guard, validateId, wrapError(getContact));

router.post("/", guard, validateContact, wrapError(saveContact));

router.delete("/:contactId", guard, validateId, wrapError(removeContact));

router.put(
  "/:contactId",
  guard,
  [validateId, validateContact],
  wrapError(updateContact)
);

router.patch(
  "/:contactId/favorite",
  guard,
  [validateId, validateStatusContact],
  wrapError(updateStatusFavoriteContact)
);

module.exports = router;
