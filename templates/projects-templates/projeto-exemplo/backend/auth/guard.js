"use strict";
const createDebug = require("debug");

const error = createDebug("error");
const debug = createDebug("debug");

require("dotenv").config();

async function autenticar(req, res, next) {
  req.user = { id_tenant: 1 };
  next();

  /*  
  const authHeader = req.headers["authorization"];
  if (!authHeader){
    return res.status(401).send({
      mensagem: "Cabeçalho de autenticação não informado.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send({
      mensagem: "Cabeçalho de autenticação fora do padrão.",
    });
  }

  jwt.verify(
    token,
    process.env.SECRET,
    { algorithms: ["HS256"] },
    (err, payload) => {
      if (err) {
        return res.status(401).send({
          mensagem: "Token de acesso inválida.",
        });
      }
      req.user = payload.data;

      next();
    }
  );
  */
}

function autorizar(req, res, next) {
  const usuario = req.user;
  const resource = req.url.split("/")[1].split("?")[0].replace(/\//g, "");
  const action = req.method.toLowerCase();

  const db = require("../models");

  return next();

  db.Permissao.findAll({
    where: { id_tenant: usuario.id_tenant, ativa: true, recurso: resource },
  })
    .then((result) => {
      if (result) {
        if (result.feedback.docs.length > 0) {
          const permission = result.feedback.docs[0].roles.find(
            (item) => item.name === usuario.role
          );
          if (permission && permission.actions.indexOf(action) > -1) {
            return next();
          }
        }
        debug("Nenhuma permissão encontrada.");
        return res
          .status(403)
          .send({mensagem:"Você não possui permissão para executar esta ação."});
      }
      debug("A consulta não retornou OK.");
      return res
        .status(403)
        .send({mensagem:"Você não possui permissão para executar esta ação."});
    })
    .catch((error) => {
      debug(error);
      return res.status(403).send({mensagem:"Não foi possíve validar as permissões."});
    });
}

module.exports = {
  autenticar,
};
