const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  nonexistentResourceError,
  defaultError,
  itemNotFoundError,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  console.log("trying to get items");

  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      return res.status(defaultError.status).send({
        message: defaultError.message,
      });
    });
};

const createClothingItem = (req, res) => {
  console.log("trying to create an item");
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError.status).send({
          message:
            invalidDataError.message +
            " Make sure your information is correct and try again.",
        });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const deleteClothingItem = (req, res) => {
  console.log("trying to delete item");
  const { itemId } = req.params;

  ClothingItem.findByIdAndRemove(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item Deleted" }))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(nonexistentResourceError.status)
          .send({ message: nonexistentResourceError.message });
      } else if (err.name === "Error") {
        return res
          .status(itemNotFoundError.status)
          .send({ message: itemNotFoundError.message });
      } else {
        return res.status(defaultError.status).send({
          message: defaultError.message,
        });
      }
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
