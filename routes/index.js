const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likesRouter = require("./likes");
const signRouter = require("./sign");
const { dataNotFoundError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likesRouter);
router.use("/", signRouter);

router.use((req, res) => {
  console.log(req);
  res.status(dataNotFoundError.status).send({
    message:
      "Error here with the main routing" /* message: dataNotFoundError.message */,
  });
});

module.exports = router;
