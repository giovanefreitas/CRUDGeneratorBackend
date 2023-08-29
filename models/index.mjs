import mongoose from "mongoose";
import projects from "./project.model.mjs";
import screens from "./screen.model.mjs";
import entities from "./entity.model.mjs";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.ATLAS_URI;
db.projects = projects(mongoose);
db.screens = screens(mongoose);
db.entities = entities(mongoose);

db.connect = () => {
  return db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default db;
