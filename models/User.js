const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: String,
  },
  { versionKey: false, timestamps: true }
);

const userRegisrtationSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
});

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
});

const schemas = { userRegisrtationSchema, userLoginSchema };

const User = model("user", schema);

module.exports = { User, schemas };
