const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateCardBody, validateIds } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateCardBody, createClothingItem);
router.delete("/:itemId", auth, validateIds, deleteClothingItem);
module.exports = router;
