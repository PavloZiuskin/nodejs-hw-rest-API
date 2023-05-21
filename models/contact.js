const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    favorite: {type: Boolean, default: false, required: true},
},{versionKey: false, timestamps: true})

const Contact = model("contact", contactSchema);
contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});
const updateFavoriteSchemaValidation = Joi.object({
    favorite: Joi.boolean()
      .required()
      .messages({ "any.required": "missing field favorite" }),
  });
const schemes = { addSchema, updateFavoriteSchemaValidation };

module.exports = {Contact, schemes}