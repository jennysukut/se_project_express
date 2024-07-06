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

const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const login = (req, res, next) => {
  console.log("trying to log in");
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Username and password are required");
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Incorrect email or password")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password")
          );
        }

        console.log(user);
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })

    .catch(next);
};

const getCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User Not Found"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  console.log("trying to update profile");

  const { name, avatar } = req.body;
  const { _id } = req.user;
  console.log(name, avatar, _id);

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return next(new NotFoundError("Data Not Found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Error: Invalid Data."));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  console.log("trying to create a user");

  const { name, avatar, email } = req.body;
  console.log(name, avatar, email);

  if (!email) {
    next(new BadRequestError("Email is Required"));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(
          new ConflictError("An account for this email already exists")
        );
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
        return next(new BadRequestError("Error: Invalid Data"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
