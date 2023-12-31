import projects from "./project.route.mjs";
import screens from "./screen.route.mjs";
import entities from "./entity.route.mjs";
import { Router } from "express";

export default () => {
  let router = Router();

  router.use("/projects", projects());
  router.use("/screens", screens());
  router.use("/entities", entities());

  return router;
};
