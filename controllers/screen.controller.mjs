import { ObjectId } from "mongodb";
import db from "../models/index.mjs";
import createDebug from "debug";

const debug = createDebug("screen-controller");

const Screen = db.screens;

// Create and Save a new Screen
const create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }

  // Create a Screen
  const screen = new Screen({
    name: req.body.name,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
    labelMenu: req.body.labelMenu,
    title: req.body.title,
    subtitle: req.body.subtitle,
    project_id: new ObjectId(req.body.project_id),
    referenced_entity_id: new ObjectId(req.body.referenced_entity_id),
  });

  // Save Screen in the database
  screen
    .save(screen)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Screen.",
      });
    });
};

// Retrieve all Screens from the database.
const findAll = (req, res) => {
  let condition = {};

  if (!req.query.project) {
    res.status(400).send({ message: "ID do projeto não informado!" });
    return;
  }

  condition.project_id = new ObjectId(req.query.project);

  Screen.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving screens.",
      });
    });
};

// Find a single Screen with an id
const findOne = (req, res) => {
  const id = req.params.id;

  Screen.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Screen with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      debug(err);
      res
        .status(500)
        .send({ message: "Error retrieving Screen with id=" + id });
    });
};

// Update a Screen by the id in the request
const updateOne = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Screen.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Screen with id=${id}. Maybe Screen was not found!`,
        });
      } else res.send({ message: "Screen was updated successfully." });
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: "Error updating Screen with id=" + id,
      });
    });
};

// Delete a Screen with the specified id in the request
const deleteOne = (req, res) => {
  const id = req.params.id;

  Screen.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Screen with id=${id}. Maybe Screen was not found!`,
        });
      } else {
        res.send({
          message: "Screen was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: "Could not delete Screen with id=" + id,
      });
    });
};

// Delete all Screens from the database.
const deleteAll = (req, res) => {
  Screen.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Screens were deleted successfully!`,
      });
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all screens.",
      });
    });
};

// Find all published Screens
const findAllPublished = (req, res) => {
  Screen.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving screens.",
      });
    });
};

export default {
  create,
  findAll,
  findAllPublished,
  findOne,
  updateOne,
  deleteOne,
  deleteAll,
};
