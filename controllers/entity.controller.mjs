import { ObjectId } from "mongodb";
import db from "../models/index.mjs";
import createDebug from "debug";

const debug = createDebug("entity-controller");

const Entity = db.entities;

// Create and Save a new Entity
const create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }

  // Create a Entity
  const entity = new Entity({
    name: req.body.name,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
    project_id: new ObjectId(req.body.project_id),
  });

  // Save Entity in the database
  entity
    .save(entity)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Entity.",
      });
    });
};

// Retrieve all Entities from the database.
const findAll = (req, res) => {
  let condition = {};

  if (!req.query.project) {
    res.status(400).send({ message: "ID do projeto não informado!" });
    return;
  }

  condition.project_id = new ObjectId(req.query.project);

  Entity.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entities.",
      });
    });
};

// Find a single Entity with an id
const findOne = (req, res) => {
  const id = req.params.id;

  Entity.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Entity with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      debug(err);
      res
        .status(500)
        .send({ message: "Error retrieving Entity with id=" + id });
    });
};

// Update a Entity by the id in the request
const updateOne = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Entity.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Entity with id=${id}. Maybe Entity was not found!`,
        });
      } else res.send({ message: "Entity was updated successfully." });
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: "Error updating Entity with id=" + id,
      });
    });
};

// Delete a Entity with the specified id in the request
const deleteOne = (req, res) => {
  const id = req.params.id;

  Entity.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Entity with id=${id}. Maybe Entity was not found!`,
        });
      } else {
        res.send({
          message: "Entity was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: "Could not delete Entity with id=" + id,
      });
    });
};

// Delete all Entities from the database.
const deleteAll = (req, res) => {
  Entity.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Entities were deleted successfully!`,
      });
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all entities.",
      });
    });
};

// Find all published Entities
const findAllPublished = (req, res) => {
  Entity.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entities.",
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
