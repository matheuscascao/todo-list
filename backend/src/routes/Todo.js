import express from "express";
import db from "../config/db.js";
import todoItem from "../models/todoItem.js";
const router = express.Router();

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("MongoDB database connection established successfully");
})


router.get("/:status?", (req, res) => {
  if (req.query.status) {
      console.log(`status: ${req.query.status}`)
        todoItem.find({status: req.query.status}).then((data) => {
          console.log(data);
          res.status(200).json(data);
        });
      }
      else {
        todoItem.find().then((data) => {
          console.log(`Data: ${data}`);
          res.status(200).json(data);
        })
      }
})

router.post("/", (req, res) => {
  let item = new todoItem(req.body);

  item.save().then(() => {
    res.status(200).json({ message: item.toJSON() });
  }).catch((err) => {
    res.status(500).json({ message: err })
  })
})

router.patch("/:title?", (req, res) => {
  let itemTitle = req.query.title;
  todoItem.findByIdAndUpdate({title: itemTitle}, req.body).then(() => {
    res.status(200).json({ message: req.body.toJSON()});
  }).catch((err) => res.status(500).json({ message: err }))
  res.send({ data: "updated data"});
})

router.delete("/:title?", (req, res) => {
  let title = req.query.title;

  todoItem.findOneAndDelete({ title: title }).then( () => {
    res.status(200).json({ message: req.body.toJSON() });
  }).catch((err) => res.status(500).json({ message: err }))
})

export default router;