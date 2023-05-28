const {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
} = require("../contactServices/contactsServices");
const HttpError = require("../utils/HttpError");
const controllerWrapper = require("../utils/controllerWrapper");
const { Contact } = require("../models/Contact");

const getContact = controllerWrapper(async (req, res) => {
  const {page = 1, limit = 10} = req.query;
  const { _id: owner } = req.user;
  const contacts = await listContactsService(limit, page, owner);
  res.status(200).json(contacts);
});

const getContactById = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const contacts = await getContactByIdService(id);
  res.status(200).json(contacts);
});

const createContact = controllerWrapper(async (req, res) => {
  validation(req.body);
  const body = req.body;
  const { _id: owner } = req.user;
  const newContact = await addContactService(body, owner);
  return res.status(201).json(newContact);
});

const updateContact = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const updatedContact = await updateContactService(id, body);
  if (!updatedContact) {
    throw new HttpError(404, `Contact with ${id} not found`);
  }
  res.json(updatedContact);
});

const deleteContact = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const deletedContact = await removeContactService(id);
  res.status(204).json(deletedContact);
});

const updateStatusContact = controllerWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    throw new HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(contact);
});

module.exports = {
  deleteContact,
  updateContact,
  createContact,
  getContact,
  getContactById,
  updateStatusContact,
};
