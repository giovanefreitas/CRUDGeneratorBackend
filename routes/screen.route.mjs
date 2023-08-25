import screens from "../controllers/screen.controller.mjs";
import { Router } from "express";

export default () => {
  let router = Router();

  // Create a new Project
  router.post("/", screens.create);

  // Retrieve all Projects
  router.get("/", screens.findAll);

  // Retrieve all published Projects
  router.get("/published", screens.findAllPublished);

  // Retrieve a single Project with id
  router.get("/:id", screens.findOne);

  // Update a Project with id
  router.put("/:id", screens.updateOne);

  // Delete a Project with id
  router.delete("/:id", screens.deleteOne);

  // Delete all Projects
  router.delete("/", screens.deleteAll);

  return router;
};
