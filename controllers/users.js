const User = require("../models/user");
const {
  invalidDataError,
  defaultError,
  userNotFoundError,
} = require("../utils/errors");

const getUsers = (req, res) => {
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
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("CastError");
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "Error") {
        return res
          .status(userNotFoundError.status)
          .send({ message: userNotFoundError.message });
      } else {
        return res
          .status(defaultError.status)
          .send({ message: defaultError.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError.status).send({
          message:
            invalidDataError.message +
            " Username & Avatar must meet required parameters",
        });
      } else {
        return res
          .status(defaultError.status)
          .send({ message: defaultError.message });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
