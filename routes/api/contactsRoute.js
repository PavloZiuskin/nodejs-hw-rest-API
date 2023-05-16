const express = require('express');
const {
  deleteContact,
  updateContact,
  createContact,
  getContact,
  getContactById
} = require('../../controllers/contactControllers') 

const router = express.Router();

router.get('/', getContact)

router.get('/:contactId',getContactById)

router.post('/', createContact)

router.delete('/:contactId',deleteContact)

router.put('/:contactId', updateContact)

module.exports = {contactsRoute: router}
