const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrent,
} = require("../../controllers/authControllers");

const authenticate = require("../../midleware/authenticate");

const validateBody = require("../../midleware/validationSchema");

const { schemas } = require("../../models/User");

const {handleUserByIdError} = require("../../helpers")


router.post("/register", validateBody(schemas.userRegisrtationSchema), register);

router.post("/login", validateBody(schemas.userLoginSchema), login);

router.get("/current", authenticate, handleUserByIdError, getCurrent);

router.post("/logout", authenticate, handleUserByIdError, logout);

module.exports = {authRoute: router};
