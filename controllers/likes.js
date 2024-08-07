const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ClothingItem = require("../models/clothingItem");

const likeItem = (req, res, next) => {
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
        next(new BadRequestError("Error: Invalid Data"));
      }
      if (err.name === "Error") {
        next(new NotFoundError("Data Not Found"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
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
        next(new BadRequestError("Error: Invalid Data"));
      }
      if (err.name === "Error") {
        next(new NotFoundError("Data Not Found"));
      } else {
        next(err);
      }
    });
};

module.exports = { likeItem, dislikeItem };
