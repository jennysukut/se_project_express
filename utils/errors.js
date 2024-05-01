const invalidDataError = {
  status: 400,
  message: "Error: Invalid Data.",
};

const nonexistentResourceError = {
  status: 400,
  message: "Requested resource not found.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

const userNotFoundError = {
  status: 404,
  message: "User ID Not Found.",
};

const itemNotFoundError = {
  status: 404,
  message: "Item Not Found.",
};

module.exports = {
  invalidDataError,
  nonexistentResourceError,
  defaultError,
  userNotFoundError,
  itemNotFoundError,
};
