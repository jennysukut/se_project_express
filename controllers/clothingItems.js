const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  console.log("trying to get items");
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};
const createItem = (req, res) => {
  console.log("trying to create an item");
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      console.log("Error with CreateItem");
      return res.status(500).send({ message: "err.message" });
    });
};
const deleteItem = (req, res) => {
  console.log("trying to delete item");
};

module.exports = { getItems, createItem, deleteItem };
