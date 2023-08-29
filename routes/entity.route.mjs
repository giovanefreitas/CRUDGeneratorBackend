import entities from "../controllers/entity.controller.mjs";
import { Router } from "express";

export default () => {
  let router = Router();

  // Create a new Entity
  router.post("/", entities.create);

  // Retrieve all Entity
  router.get("/", entities.findAll);

  // Retrieve all published Entity
  router.get("/published", entities.findAllPublished);

  // Retrieve a single Entity with id
  router.get("/:id", entities.findOne);

  // Update a Entity with id
  router.put("/:id", entities.updateOne);

  // Delete a Entity with id
  router.delete("/:id", entities.deleteOne);

  // Delete all Entity
  router.delete("/", entities.deleteAll);

  return router;
};
