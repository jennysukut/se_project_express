const errorHandler = (err, req, res, next) => {
  console.log("trying error handler");
  console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An error occured on the server or in the error handler"
        : message,
  });

  next();
};

module.exports = errorHandler;
