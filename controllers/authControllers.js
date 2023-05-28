const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

const HttpError = require("../utils/HttpError");

const controllerWrapper = require("../utils/controllerWrapper");

const { SECRET_KEY } = process.env;

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: result.name,
    email: result.email,
    token: result.token,
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
  const { email, name, } = req.user;
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

module.exports = {
  logout,
  register,
  getCurrent,
  login,
};
