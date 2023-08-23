import projects from "./project.route.mjs";
import { Router } from "express";

export default () => {
  let router = Router();

  router.use("/projects", projects());

  return router;
};
