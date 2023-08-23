import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import db from "./models/index.mjs";
import configureRoutes from "./routes/index.mjs";

console.log("Node Version: " + process.version);
let majorVersion = process.version.split(".")[0];
majorVersion = majorVersion.slice(1);
if (parseInt(majorVersion) < 20) {
  console.error("Versão não suportada. É necessário um node >= v20");
  process.exit(1);
}

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /cadastros routes
app.use("/api", configureRoutes());

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err);
  res.status(500).send("Ocorreu um erro inesperado.");
});

db.connect()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
