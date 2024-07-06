const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { invalidEmailOrPassError } = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  console.log("trying auth");
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new UnauthorizedError("This user is not authorized."));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    console.log("trying at jwt verify");
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("This user is not authorized."));
  }
  console.log(payload);
  req.user = payload;
  return next();
};

module.exports = auth;
