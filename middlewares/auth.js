const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    console.log("trying at jwt verify");
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({
      message:
        "Authorization Required - there was an issue with jwt verification",
    });
  }
  console.log(payload);
  req.user = payload;
  return next();
};

module.exports = auth;
