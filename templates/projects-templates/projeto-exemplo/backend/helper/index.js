"use strict";

const { ValidationError } = require("sequelize");
const createDebug = require("debug");

const error = createDebug("error");

module.exports = {
  sendError,
};

function sendError(res, err) {
  error(err);
  if (err instanceof ValidationError) {
    return res.status(500).send({
      erros: err.errors.map((item) => item.message),
    });
  }
  return res.status(500).send(err.message);
}
