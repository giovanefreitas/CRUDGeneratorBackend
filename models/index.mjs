import mongoose from "mongoose";
import projects from "./project.model.mjs";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.ATLAS_URI;
db.projects = projects(mongoose);

db.connect = () => {
  return db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default db;
