const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likesRouter = require("./likes");
const signRouter = require("./sign");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likesRouter);
router.use("/", signRouter);

router.use((req, res, next) => {
  console.log(req);
  return next(new NotFoundError("User Not Found"));
});

module.exports = router;
