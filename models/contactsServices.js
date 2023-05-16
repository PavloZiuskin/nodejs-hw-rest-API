const fs = require('fs/promises');
const path = require('path');
const crypto = require("crypto");

const contactsPath = path.join(process.cwd(), "models", "contacts.json")

const listContactsService = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts)
}

const getContactByIdService = async (contactId) => {
  const contacts = await listContactsService();
  return contacts.find(contact => contact.id === contactId);
}

const removeContactService = async (contactId) => {
  const contacts = await listContactsService();
  const index = contacts.findIndex(contact=> contact.id === contactId);
  if(index === -1){
      throw new Error("contacts not found");
  }
  contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contactId;

}

const addContactService = async (body) => {
  const contacts = await listContactsService();
  const newContact = {id: crypto.randomUUID(), ...body};
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;

}

const updateContactService = async (contactId, body) => {
  const contacts = await listContactsService();
  let contact = contacts.find(contact => contact.id === contactId);
  if(!contact){
    throw new Error("contact not found");
  }
  contacts = { ...contact, ...body};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts;
}

module.exports = {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
}
