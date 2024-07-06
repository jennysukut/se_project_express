const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");
const auth = require("../middlewares/auth");
const { validateIds } = require("../middlewares/validation");

router.put("/:itemId/likes", auth, validateIds, likeItem);
router.delete("/:itemId/likes", auth, validateIds, dislikeItem);

module.exports = router;
