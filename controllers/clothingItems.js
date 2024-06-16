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

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      next(err);
      // console.log(err.name);
      // return res.status(defaultError.status).send({
      //   message: defaultError.message,
      // });
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
        next(new BadRequestError("Error: Invalid Data"));
        // return res.status(invalidDataError.status).send({
        //   message: invalidDataError.message,
        // });
      } else {
        next(err);
      }
      // return res
      //   .status(defaultError.status)
      //   .send({ message: defaultError.message });
    });
};

const deleteClothingItem = (req, res) => {
  console.log("trying to delete item");
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("This action is not authorized."));
        // return res
        //   .status(forbiddenError.status)
        //   .send({ messaage: forbiddenError.message });
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
        // return res
        //   .status(invalidDataError.status)
        //   .send({ message: invalidDataError.message });
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
        // return res
        //   .status(dataNotFoundError.status)
        //   .send({ message: dataNotFoundError.message });
      } else {
        next(err);
      }
      // return res.status(defaultError.status).send({
      //   message: defaultError.message,
      // });
    });

  // if (owner === _id) {
  //   ClothingItem.findByIdAndRemove(itemId)
  //     .orFail(() => {
  //       const error = new Error("Item ID not found");
  //       throw error;
  //     })
  //     .then(() => res.status(200).send({ message: "Item Deleted" }))
  //     .catch((err) => {
  //       console.error(err);
  //       console.log(err.name);
  //       if (err.name === "CastError") {
  //         return res
  //           .status(invalidDataError.status)
  //           .send({ message: invalidDataError.message });
  //       }
  //       if (err.name === "Error") {
  //         return res
  //           .status(dataNotFoundError.status)
  //           .send({ message: dataNotFoundError.message });
  //       }
  //       return res.status(defaultError.status).send({
  //         message: defaultError.message,
  //       });
  //     });
  // }
  // if (owner === !_id) {
  //   console.log("You're not the owner of this item");
  //   return res.status(403);
  // }
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
