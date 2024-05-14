const invalidDataError = {
  status: 400,
  message: "Error: Invalid Data.",
};

const invalidEmailOrPassError = {
  status: 401,
  message: "Invalid Username or Password.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

const dataNotFoundError = {
  status: 404,
  message: "Data Not Found - testing test",
};

module.exports = {
  invalidDataError,
  defaultError,
  dataNotFoundError,
  invalidEmailOrPassError,
};
