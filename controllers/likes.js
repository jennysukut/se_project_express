const ClothingItem = require("../models/clothingItem");

const likeItem = (req, res) => {
  console.log("trying to like an item");
  const { itemId } = req.params;
  console.log(itemId);
  //
  // ClothingItem.findByIdAndUpdate(
  // req.params.itemId,
  // { $addToSet: { likes: req.user._id } },
  // { new: true }
  // )
  // .orFail(() => {
  // const error = new Error("Item ID not found");
  // error.statusCode = 404;
  // throw error;
  // })
  // .then((item) => {
  // console.log("item liked?");
  // console.log(item);
  // res.status(200).send({ item });
  // })
  // .catch((err) => console.error(err));
};

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  );

module.exports = { likeItem, dislikeItem };
