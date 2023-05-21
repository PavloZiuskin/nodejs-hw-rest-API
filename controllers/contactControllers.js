
const {listContactsService,
    getContactByIdService,
    removeContactService,
    addContactService,
    updateContactService} = require('../models/contactsServices');
const {validation} = require('../midleware/validationSchema');
const {HttpError}= require('../helpers/');
const { Contact, schemes } = require("../models/contact");


const getContact = async (req, res, next) =>{
    try {
        const contacts = await listContactsService();
        res.status(200).json(contacts);
      } catch (error) {
        next(error);
      }
};

const getContactById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const contacts = await getContactByIdService(id);
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  };
  
  const createContact = async (req, res, next) => {
    try {
      validation(req.body);
      const body = req.body;
      const newContact = await addContactService(body);
      return res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  };
  
  const updateContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const error = validation(req.body);
      if(error){
        throw new HttpError(400, error.message);
      }
      const updatedContact = await updateContactService(id, body);
      if (!updatedContact) {
        throw new HttpError(404, `Contact with ${id} not found`);
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  };
  
  const deleteContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedContact = await removeContactService(id);
      res.status(204).json(deletedContact);
    } catch (error) {
      next(error);
    }
  };
  const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const { error } = schemes.updateFavoriteSchemaValidation.validate(req.body);
      if (error) {
        throw new HttpError(400, error.message);
      }
      const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!contact) {
        throw new HttpError(404, `Contact with ${contactId} not found`);
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    deleteContact,
    updateContact,
    createContact,
    getContact,
    getContactById,
    updateStatusContact
  }