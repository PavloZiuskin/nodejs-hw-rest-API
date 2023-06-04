const { Contact } = require("../models/Contact");


const listContactsService = async (limit, page, owner) => {
  const skip = ((page - 1) * limit);
  return await Contact.find({ owner }, "-createdAt -updatedAt").populate(
    "owner",
    "name email phone"
  ).limit(limit).skip(skip);
};

const getContactByIdService = async (contactId) => {
  return await Contact.findOne({ contactId });
};

const removeContactService = async (contactId) => {
  return await Contact.findByIdAndRemove({ contactId });
};

const addContactService = async (body, owner) => {
  return await Contact.create({ ...body, owner });
};

const updateContactService = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};



module.exports = {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService
};
