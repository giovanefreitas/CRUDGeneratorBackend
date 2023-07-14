const express = require("express");
const { autenticar } = require("../auth/guard");
const avaliacoesDiagnosticas = require("./avaliacoes-diagnosticas");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send({ title: process.env.APP_TITLE });
});

router.get("/versao", (req, res) => {
  res.status(200).json({
    versao: process.env.APP_VERSAO,
  });
});

router.use("/avaliacoes-diagnosticas", autenticar, avaliacoesDiagnosticas);

router.get("/versao", (req, res) => {
  res.status(200).json({
    versao: process.env.APP_VERSAO,
  });
});

router.get("*", autenticar, function (req, res) {
  res.status(404).json({ mensagem: "O recurso solicitado não existe." });
});

module.exports = router;
