const invalidDataError = {
  status: 400,
  message: "Error: Invalid Data.",
};

const invalidEmailOrPassError = {
  status: 401,
  message: "Invalid Username or Password.",
};

const forbiddenError = {
  status: 403,
  message: "This action is not authorized.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

const dataNotFoundError = {
  status: 404,
  message: "Data Not Found",
};

const duplicateError = {
  status: 409,
  message: "An account for this email already exists.",
};

module.exports = {
  invalidDataError,
  defaultError,
  dataNotFoundError,
  invalidEmailOrPassError,
  duplicateError,
  forbiddenError,
};
