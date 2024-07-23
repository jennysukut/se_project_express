const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { validateNameAvatar } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateNameAvatar, updateProfile);

module.exports = router;
