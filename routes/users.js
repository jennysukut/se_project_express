const router = require("express").Router();
const {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
