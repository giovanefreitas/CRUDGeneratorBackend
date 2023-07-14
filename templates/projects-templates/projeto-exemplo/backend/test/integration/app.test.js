"use strict";

const { app, getTokenAcesso } = require("../util/test-server");

const request = require("supertest");
const assert = require("assert");
const models = require("../../models");

describe(`Testes básicos`, () => {
  it("validar versão", (done) => {
    request(app)
      .get("/versao")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(`{"versao":"${process.env.APP_VERSAO}"}`, done);
  });

});
