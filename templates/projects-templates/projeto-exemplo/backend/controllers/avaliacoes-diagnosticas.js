"use strict";

const models = require("../models");
const helper = require("../helper");
const cloneDeep = require("lodash/cloneDeep");
const validadorJson = require("../helper/validador-json");
const createDebug = require('debug');

const error = createDebug('error');
const debug = createDebug('debug');

module.exports = {
  pesquisar,
  recuperar,
  criar,
  alterar,
  excluir,
  exportar,
  restaurar,
};

async function pesquisar(req, res) {
  try {
    var pagina = req.query.pagina ? parseInt(req.query.pagina) : 1;
    if (isNaN(pagina)) pagina = 1;
    var opcoes = montarOpcoesPesquisa(req);
    opcoes.limit = req.query.tamanhoPagina ? parseInt(req.query.tamanhoPagina) : 30;
    if (isNaN(opcoes.limit)) opcoes.limit = 30
    opcoes.offset = (pagina - 1) * opcoes.limit;


    const { count, rows } = await models.AvaliacaoDiagnostica.findAndCountAll(opcoes);

    //TODO: Remover, sleep para testar latência
    await new Promise(r => setTimeout(r, 2000));

    //TODO: Tratar erro da requisição abaixo:
    //http://localhost:3001/avaliacoes-diagnosticas?pagina=undefined&tamanhoPagina=5&textoBusca=&ordenar=dataAlteracao&ordemInversa=false&nome=&codigoNacional=&dataNascimento=&logradouro=&bairro=&municipio=&uf=&cep=&telefone=&email=&nomeContato=

    return res.status(200).send({
      resultados: rows,
      total: count,
      pagina,
      total_paginas: Math.ceil(count / opcoes.limit)
    });
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}
async function recuperar(req, res) {
  try {
    if (!Number.parseInt(req.params._id)) {
      return res.status(400).send({ mensagem: 'O parâmetro "id" é obrigatório.' });
    }

    //TODO: Remover, sleep para testar latência
    await new Promise(r => setTimeout(r, 2000));

    var result = await models.AvaliacaoDiagnostica.findOne({
      where: {
        id: req.params._id,
        id_tenant: req.user.id_tenant,
      },
      include: [],
    });

    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(204).send();
    }
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}

async function criar(req, res) {
  try {

    const erros = validadorJson.validarAvaliacaoDiagnostica(req.body);
    if (erros.length > 0) {
      return res.status(400).send(JSON.stringify(erros));
    }

    const config = req.app.get("config");

    var novo = cloneDeep(req.body);
    delete novo.id;

    novo.ativo = true;
    novo.firstAccess = true;
    novo.systemUser = novo.systemUser || false;
    novo.id_tenant = req.user.id_tenant;

    const result = await models.AvaliacaoDiagnostica.create(novo, {
      include: [],
    });

    return res.status(200).send(result);
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}

async function alterar(req, res) {
  try {
    if (!Number.parseInt(req.params._id)) {
      return res.status(400).send({ mensagem: 'O parâmetro "id" é obrigatório.' });
    }
    const erros = validadorJson.validarAvaliacaoDiagnostica(req.body);
    if (erros.length > 0) {
      return res.status(400).send(JSON.stringify(erros));
    }

    var novo = cloneDeep(req.body);
    delete novo.id;
    delete novo.id_tenant;

    const result = await models.AvaliacaoDiagnostica.update(novo, {
      where: {
        id: req.params._id,
        id_tenant: req.user.id_tenant,
      },
    });

    if (!result || result[0] == 0) {
      return res
        .status(400)
        .send({ message: "O registro informado não existe." });
    }
    
    return recuperar(req, res);
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}

async function excluir(req, res) {
  try {
    //TODO: Remover, sleep para testar latência
    await new Promise(r => setTimeout(r, 2000));
    
    const listaID = req.params._id.split(",");
    let result;
    if (listaID.length == 1) {
      result = await models.AvaliacaoDiagnostica.destroy({
        where: {
          id: req.params._id,
          id_tenant: req.user.id_tenant,
          
        },
      });
    } else {
      result = await models.AvaliacaoDiagnostica.destroy({
        where: {
          id: {
            [models.Sequelize.Op.in]: listaID,
          },
          id_tenant: req.user.id_tenant,          
        },
      });
    }
    debug(result);
    return res.status(200).send({ excluidos: result });
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}

async function restaurar(req, res) {
  try {
    const listaID = req.params._id.split(",");
    if (listaID.length == 1) {
      const result = await models.AvaliacaoDiagnostica.restore({
        where: {
          id: req.params._id,
          id_tenant: req.user.id_tenant,
          
        },
      });
      return recuperar(req, res);
    } else {
      const result = await models.AvaliacaoDiagnostica.restore({
        where: {
          id: {
            [models.Sequelize.Op.in]: listaID,
          },
          id_tenant: req.user.id_tenant,
          
        },
      });
      return res.status(200).send({ restaurados: result });
    }
  } catch (err) {
    error(err.message);
    error(err);
    return helper.sendError(res, err);
  }
}

async function exportar(req, res) {
  var xl = require("excel4node");
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("AvaliacoesDiagnosticas");

  var linhaAtual = 1;

  var avaliacoesDiagnosticas = await models.AvaliacaoDiagnostica.findAll(montarOpcoesPesquisa(req));

  ws.cell(linhaAtual, 1).string("Código");
  linhaAtual += 1;
  
  for (let i = 0; i < avaliacoesDiagnosticas.length; i++) {
    let avaliacaoDiagnostica = avaliacoesDiagnosticas[i];
    ws.cell(linhaAtual, 1).number(avaliacaoDiagnostica.id);
    linhaAtual += 1;
  }

  wb.write("AvaliacoesDiagnosticas.xlsx", res);
}

function montarOpcoesPesquisa(req) {
  var ordem = [];
  if (req.query.ordenar && req.query.ordenar != "undefined") {
    ordem = [
      [req.query.ordenar, req.query.ordemInversa == "true" ? "DESC" : "ASC"],
      ["id", req.query.ordemInversa == "true" ? "DESC" : "ASC"],
    ];
  }

  const opcoes = {
    where: {
      id_tenant: req.user.id_tenant,
      
    },
    order: ordem,
  };

  // if (req.query.textoBusca) {
  //   const numero = req.query.textoBusca.replace(/[^\d]+/g, "");
  //   if (numero) {
  //     opcoes.where = Object.assign(opcoes.where, {
  //       [models.Sequelize.Op.or]: {
  //         codigoNacional: {
  //           [models.Sequelize.Op.like]: numero + "%",
  //         },
  //         nome: {
  //           [models.Sequelize.Op.like]:
  //             "%" + req.query.textoBusca.replace(/\s/g, "%") + "%",
  //         },
  //       },
  //     });
  //   } else {
  //     opcoes.where.nome = {
  //       [models.Sequelize.Op.like]:
  //         "%" + req.query.textoBusca.replace(/\s/g, "%") + "%",
  //     };
  //   }
  // }

  // if (req.query.nome) {
  //   opcoes.where.nome = {
  //     [models.Sequelize.Op.like]:
  //       "%" + req.query.nome.replace(/\s/g, "%") + "%",
  //   };
  // }
  // if (req.query.codigoNacional) {
  //   opcoes.where.codigoNacional = {
  //     [models.Sequelize.Op.like]:
  //       req.query.codigoNacional.replace(/[^\d]+/g, "") + "%",
  //   };
  // }
  if (req.query.dataNascimento) {
    opcoes.where.dataNascimento = {
      [models.Sequelize.Op.gt]: new Date(req.query.dataNascimento),
    };
  }
  if (req.query.telefone) {
    opcoes.where = Object.assign(opcoes.where, {
      [models.Sequelize.Op.or]: {
        telefone: {
          [models.Sequelize.Op.eq]: req.query.telefone.replace(/[^\d]+/g, ""),
        },
        celular: {
          [models.Sequelize.Op.eq]: req.query.telefone.replace(/[^\d]+/g, ""),
        },
      },
    });
  }
  if (req.query.email) {
    opcoes.where.email = {
      [models.Sequelize.Op.like]: "%" + req.query.email + "%",
    };
  }
  if (req.query.nomeContato) {
    opcoes.where.nomeContato = {
      [models.Sequelize.Op.like]:
        "%" + req.query.nomeContato.replace(/\s/g, "%") + "%",
    };
  }

  return opcoes;
}
