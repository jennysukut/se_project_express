const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  defaultError,
  dataNotFoundError,
  forbiddenError,
} = require("../utils/errors");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createClothingItem = (req, res, next) => {
  console.log("trying to create an item");
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Error: Invalid Data"));
      } else {
        next(err);
      }
    });
};

const deleteClothingItem = (req, res, next) => {
  console.log("trying to delete item");
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("This action is not authorized."));
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item Deleted" }));
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Error: Invalid Data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
      } else {
        next(err);
      }
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
