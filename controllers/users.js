const User = require("../models/user");
const {
  invalidDataError,
  defaultError,
  dataNotFoundError,
  invalidEmailOrPassError,
} = require("../utils/errors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  console.log("trying to log in");
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(invalidEmailOrPassError.status)
        .send({ message: invalidEmailOrPassError.message });
    });
};

const getCurrentUser = (req, res) => {
  console.log("trying to get current user");

  const { _id } = req.body;
  User.find({ _id })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      res
        .status(dataNotFoundError.status)
        .send({ message: dataNotFoundError.message });
    });
};

const updateProfile = (req, res) => {
  console.log("trying to update profile");
  const { name, avatar, _id } = req.body;
  User.find({ _id })
    .then((user) => {
      if (name === !user.name) {
        findOneAndUpdate(name, { new: true });
      }
      if (avatar === !user.avatar) {
        findOneAndUpdate(avatar, { new: true, runValidator: true });
      }
      return user;
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        res
          .status(dataNotFoundError.status)
          .send({ message: dataNotFoundError.message });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidDataError.status).send({
          message: invalidDataError.message,
        });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const getUsers = (req, res) => {
  console.log("trying to get users");
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const getUser = (req, res) => {
  console.log("trying to find a user");
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("UserNotFound");
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(invalidDataError.status)
          .send({ message: invalidDataError.message });
      }
      if (err.name === "Error") {
        return res
          .status(dataNotFoundError.status)
          .send({ message: dataNotFoundError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const createUser = (req, res) => {
  console.log("trying to create a user");
  const { name, avatar, email } = req.body;
  console.log(name, avatar, email);

  bcrypt.hash(req.body.password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .orFail(() => {
        const error = new Error("Email address already in use");
        throw error;
      })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.name === "ValidationError") {
          return res.status(invalidDataError.status).send({
            message: `${invalidDataError.message} Username & Avatar must meet required parameters`,
          });
        }
        if (err.name === "Error") {
          return res
            .status(400)
            .send({ message: "Email address already in use" });
        }
        return res
          .status(defaultError.status)
          .send({ message: defaultError.message });
      })
  );
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
