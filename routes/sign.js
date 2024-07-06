const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const {
  validateLoginInformation,
  validateUserInfo,
} = require("../middlewares/validation");

router.post("/signin", validateLoginInformation, login);
router.post("/signup", validateUserInfo, createUser);

module.exports = router;
