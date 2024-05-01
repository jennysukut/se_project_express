const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/", likeItem);
router.delete("/", dislikeItem);

module.exports = router;

// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item
