const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");
const {
  invalidDataError,
  defaultError,
  dataNotFoundError,
  invalidEmailOrPassError,
  duplicateError,
} = require("../utils/errors");

const login = (req, res) => {
  console.log("trying to log in");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(invalidDataError.status).send({
      message: `${invalidDataError.message} Username and password are required.`,
    });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        console.log(user);
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })

    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(invalidEmailOrPassError.status)
          .send({ message: invalidEmailOrPassError.message });
      }

      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const getCurrentUser = (req, res) => {
  console.log("trying to get current user");
  const { _id } = req.user;
  console.log(_id);

  User.findById({ _id })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(dataNotFoundError.status)
          .send({ message: dataNotFoundError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const updateProfile = (req, res) => {
  console.log("trying to update profile");

  const { name, avatar } = req.body;
  const { _id } = req.user;
  console.log(name, avatar, _id);

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidator: true }
  )
    .then((user) => res.status(200).send({ user }))
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

const createUser = (req, res) => {
  console.log("trying to create a user");

  const { name, avatar, email } = req.body;
  console.log(name, avatar, email);

  if (!email) {
    return res
      .status(invalidDataError.status)
      .send({ message: invalidDataError.message });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(duplicateError.status)
          .send({ message: duplicateError.message });
      }
      return bcrypt.hash(req.body.password, 10).then((hash) =>
        User.create({ name, avatar, email, password: hash }).then((newUser) =>
          res.status(201).send({
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          })
        )
      );
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError.status).send({
          message: `${invalidDataError.message} Information must meet required parameters`,
        });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    })
    .catch(() =>
      res.status(defaultError.status).send({ message: defaultError.message })
    );
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
