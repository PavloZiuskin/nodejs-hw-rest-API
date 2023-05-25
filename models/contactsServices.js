
const crypto = require("crypto");
const {Contact} = require('./contact')



const listContactsService = async () => {
  return await Contact.find({}, "-createdAt -updatedAt");
}

const getContactByIdService = async (contactId) => {
  return  await Contact.findOne({ contactId });
}

const removeContactService = async (contactId) => {
  return await Contact.findByIdAndRemove({ contactId });

}

const addContactService = async (body) => {
  return await Contact.create(body);
}

const updateContactService = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId , body, { new: true });
}

module.exports = {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
}
