const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { invalidEmailOrPassError } = require("../utils/errors");

const auth = (req, res, next) => {
  console.log("trying auth");
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(invalidEmailOrPassError.status)
      .send({ message: invalidEmailOrPassError.message });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    console.log("trying at jwt verify");
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(invalidEmailOrPassError.status).send({
      message: invalidEmailOrPassError.message,
    });
  }
  console.log(payload);
  req.user = payload;
  return next();
};

module.exports = auth;
