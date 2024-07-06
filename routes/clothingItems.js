const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const validateCardBody = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateCardBody, createClothingItem); // add celebrate scheme here to validate parameters of this request?
router.delete("/:itemId", auth, validateCardBody, deleteClothingItem); // add celebrate scheme here to validate parameters of this request?

module.exports = router;
