const express = require('express');
const { autenticar } = require('../auth/guard');
const avaliacoesDiagnosticas = require("../controllers/avaliacoes-diagnosticas");

const router = express.Router();

router.get("/exportar", autenticar, avaliacoesDiagnosticas.exportar);
router.get("/:_id", autenticar, avaliacoesDiagnosticas.recuperar);
router.get("", autenticar, avaliacoesDiagnosticas.pesquisar);
router.put("/restaurar/:_id", autenticar, avaliacoesDiagnosticas.restaurar);
router.post("", autenticar, avaliacoesDiagnosticas.criar);
router.put("/:_id", autenticar, avaliacoesDiagnosticas.alterar);
router.delete("/:_id", autenticar, avaliacoesDiagnosticas.excluir);

module.exports = router;