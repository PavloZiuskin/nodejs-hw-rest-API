const Joi = require('joi');
const {listContactsService,
    getContactByIdService,
    removeContactService,
    addContactService,
    updateContactService} = require('../models/contactsServices');
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().required()
})


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
        
        const {error} = addSchema.validate(req.body);
        if(error){
            throw HttpError(400,error.message);
        }
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
      const {error} = addSchema.validate(req.body);
      if(error){
        throw HttpError(400,error.message);
    }
      const body = req.body;
      const updatedContact = await updateContactService(id, body);
      res.status(200).json(updatedContact);
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

  module.exports = {
    deleteContact,
    updateContact,
    createContact,
    getContact,
    getContactById
  }