const invalidDataError = {
  status: 400,
  message: "Error: Invalid Data.",
};

const defaultError = {
  status: 500,
  message: "An error has occurred on the server.",
};

const dataNotFoundError = {
  status: 404,
  message: "Data Not Found.",
};

module.exports = {
  invalidDataError,
  defaultError,
  dataNotFoundError,
};
