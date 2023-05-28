const express = require("express");
const {
  deleteContact,
  updateContact,
  createContact,
  getContact,
  getContactById,
  updateStatusContact,
} = require("../../controllers/contactControllers");
const validateBody = require("../../midleware/validationSchema");
const {schemes} = require("../../models/Contact");
const authenticate = require("../../midleware/authenticate");

const router = express.Router();
router.use(authenticate)

router.get("/", getContact);

router.get("/:contactId", getContactById);

router.post("/", validateBody(schemes.addSchema), createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId",validateBody(schemes.addSchema), updateContact);

router.patch("/:contactId/favorite",validateBody(schemes.updateFavoriteSchemaValidation), updateStatusContact);

module.exports = { contactsRoute: router };
