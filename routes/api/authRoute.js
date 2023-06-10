const express = require("express");
const router = express.Router();
const upload = require("../../midleware/upload");
const {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/authControllers");
const authenticate = require("../../midleware/authenticate");
const validateBody = require("../../midleware/validationSchema");
const { schemas } = require("../../models/User");
const { handleUserByIdError } = require("../../helpers");

router.post(
  "/register",
  validateBody(schemas.userRegisrtationSchema),
  register
);
router.post("/login", validateBody(schemas.userLoginSchema), login);
router.get("/current", authenticate, handleUserByIdError, getCurrent);
router.get("/verify/:verificationToken", verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.joiVerifyEmailSchema),
  resendVerifyEmail
);
router.post("/logout", authenticate, handleUserByIdError, logout);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = { authRoute: router };
