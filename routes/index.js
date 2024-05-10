const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likesRouter = require("./likes");
const { dataNotFoundError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likesRouter);
router.use((req, res) =>
  res
    .status(dataNotFoundError.status)
    .send({ message: dataNotFoundError.message })
);

module.exports = router;
