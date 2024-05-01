const ClothingItem = require("../models/clothingItem");
const {
  nonexistentResourceError,
  defaultError,
  itemNotFoundError,
} = require("../utils/errors");

const likeItem = (req, res) => {
  console.log("trying to like an item");
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      throw error;
    })
    .then((item) => {
      console.log("item liked?");
      console.log(item);
      res.status(200).send({ item });
    })
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
      }
      return res.status(defaultError.status).send({
        message: defaultError.message,
      });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      throw error;
    })
    .then((item) => {
      console.log(item);
      res.status(200).send({ item });
    })
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
      }
      return res.status(defaultError.status).send({
        message: defaultError.message,
      });
    });
};

module.exports = { likeItem, dislikeItem };
