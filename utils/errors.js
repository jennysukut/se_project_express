const invalidDataError = {
  status: 400,
  message: "Error: Invalid Data.",
};

const nonexistentResourceError = {
  status: 404,
  message: "Requested resource not found.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

module.exports = { invalidDataError, nonexistentResourceError, defaultError };
