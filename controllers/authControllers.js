const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { User } = require("../models/User");
const HttpError = require("../utils/HttpError");
const controllerWrapper = require("../utils/controllerWrapper");
const { uploadAvatarService } = require("../contactServices/authService");
const { SECRET_KEY, BASE_URL } = process.env;
const sendEmail = require("../utils/sendMail");

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409);
  }
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = await gravatar.url(email);
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    email,
    subject: "Verify your email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: result.name,
    email: result.email,
    token: result.token,
  });
});

const verifyEmail = controllerWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new HttpError(404, `User not found`);
  }
  await User.findByIdAndUpdate(user._id, {
    verife: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
});

const resendVerifyEmail = controllerWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, `Email not found`);
  }

  if (user.verify) {
    throw new HttpError(400, `Verification has already been passed`);
  }

  const verifyEmail = {
    email,
    subject: "Verify your email",
    html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationToken}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
});

const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password incorrect");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Email or password incorrect");
  }
  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
  });
});

const getCurrent = controllerWrapper(async (req, res) => {
  const { email, name } = req.user;
  res.json({
    email,
    name,
  });
});

const logout = controllerWrapper(async (req, res) => {
  const { _id: id } = req.user;

  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
});

const updateAvatar = controllerWrapper(async (req, res) => {
  const result = await uploadAvatarService(req);
  res.status(200).json({ avatarURL: result });
});

module.exports = {
  logout,
  register,
  getCurrent,
  login,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
