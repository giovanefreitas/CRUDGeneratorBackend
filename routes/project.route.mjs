import projects from "../controllers/project.controller.mjs";
import { Router } from "express";

export default () => {
  let router = Router();

  // Create a new Project
  router.post("/", projects.create);

  // Retrieve all Projects
  router.get("/", projects.findAll);

  // Retrieve all published Projects
  router.get("/published", projects.findAllPublished);

  // Retrieve a single Project with id
  router.get("/:id", projects.findOne);

  // Update a Project with id
  router.put("/:id", projects.updateOne);

  // Delete a Project with id
  router.delete("/:id", projects.deleteOne);

  // Delete all Projects
  router.delete("/", projects.deleteAll);

  return router;
};
