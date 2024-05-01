const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likesRouter = require("./likes");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items/:itemId/likes", likesRouter);

module.exports = router;
