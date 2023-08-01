import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import cadastros from "./routes/cadastros.mjs";
import exportacao from "./routes/exportacao.mjs";
import importacao from "./routes/importacao.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /cadastros routes
app.use("/cadastros", cadastros);
app.use("/exportar", exportacao);
app.use("/importar", importacao);

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err);
  res.status(500).send("Ocorreu um erro inesperado.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
