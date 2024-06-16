const errorHandler = (err, req, res, next) => {
  console.log("trying error handler");
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occured on the server" : message,
  });

  next();
};

module.exports = errorHandler;
