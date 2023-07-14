const request = require('supertest');
const assert = require('assert');
const { QueryTypes } = require('sequelize');
const { exit } = require('process');
const assertAtributos = require('../../helper/validador-json');
const validadorJson = require('../../helper/validador-json');
const models = require('../../models');
const { app, getTokenAcesso, getIdPerfil } = require('../util/test-server');

let idAlunoProprio = null;
let idAlunoOutro = null;
let idAlunoCriado = null;

const alunoValido = {
  codigoNacional: '99081975099',
  nome: 'Fulano de Tal',
  nomeFantasia: '',
  dataNascimento: '2022-07-01T16:09:45.772Z',
  email: 'fulano@exemplo.com',
  telefone: '3132558877',
  celular: '31954878956',
  nomeContato: 'Fulano',
  ativo: true,
  endereco: {
    nome: 'Principal',
    cep: '31000000',
    logradouro: 'Av. Afonso Pena',
    numero: '100',
    complemento: 'APT 101',
    bairro: 'Centro',
    municipio: 'Belo Horizonte',
    uf: 'MG',
    pontoReferencia: '',
    ativo: true,
  },
};

// const tokenInvalida1 = jwt.sign(
//   {
//     data: {
//       id: 1,
//       nome: 'Administrador do sistema',
//       paginaInicial: null,
//       id_endereco: 3,
//       id_tenant: 1,
//     },
//   },
//   require('crypto').randomBytes(64).toString('hex'),
//   {
//     expiresIn: '8h',
//   },
// );

// const tokenInvalida2 = jwt.sign(
//   {
//     data: {
//       id: 1,
//       nome: 'Administrador do sistema',
//       paginaInicial: null,
//       id_endereco: 3,
//       id_tenant: 1,
//     },
//   },
//   '',
//   {
//     algorithm: 'none',
//     expiresIn: '8h',
//   },
// );

before((done) => {
  models.sequelize
    .query(
      'SELECT min(id) as id, id_tenant FROM alunos group by id_tenant',
      { type: QueryTypes.SELECT },
    )
    .then((rows) => {
      assert.strictEqual(
        rows.length,
        2,
        'Não existem alunos de dois perfis diferentes.',
      );

      const idPerfil = getIdPerfil();
      idAlunoProprio = rows.find((item) => item.id_tenant == idPerfil).id;
      idAlunoOutro = rows.find((item) => item.id_tenant != idPerfil).id;
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe('Alunos', () => {
  describe('GET /alunos (Listar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Sem filtros > 200', (done) => {
      request(app)
        .get('/alunos/')
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(response.body.resultados.length, 30);
          assert.strictEqual(response.body.total, 200);
          const erros = validadorJson.validarAluno(
            response.body.resultados[0],
          );
          assert.strictEqual(erros.length, 0, JSON.stringify(erros, null, 2));
          done();
        })
        .catch((err) => done(err));
    });

    
    it('Teste pesquisa simples > 200', (done) => {
      request(app)
        .get('/alunos/')
        .query({ textoBusca: 'a' })
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.ok(response.body.resultados.length > 0);
          done();
        })
        .catch((err) => done(err));
      });
      
    it('Teste pesquisa simples sem retorno > 200', (done) => {
      request(app)
        .get('/alunos/')
        .query({ textoBusca: 'gabagabahei' })
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(response.body.resultados.length, 0);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /alunos/:_id (Carregar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('ID nulo > 400', (done) => {
      request(app)
        .get('/alunos/null')
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(400)
        .then((response) => {
          assert.strictEqual(
            response.body.mensagem,
            'O parâmetro "id" é obrigatório.',
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('ID com letras > 400', (done) => {
      request(app)
        .get('/alunos/abc')
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(400)
        .then((response) => {
          assert.strictEqual(
            response.body.mensagem,
            'O parâmetro "id" é obrigatório.',
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('ID undefined > 400', (done) => {
      request(app)
        .get('/alunos/undefined')
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(400)
        .then((response) => {
          assert.strictEqual(
            response.body.mensagem,
            'O parâmetro "id" é obrigatório.',
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('Aluno próprio > 200', (done) => {
      request(app)
        .get(`/alunos/${idAlunoProprio}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          const erros = validadorJson.validarAluno(response.body);
          assert.strictEqual(erros.length, 0, JSON.stringify(erros, null, 2));
          done();
        })
        .catch((err) => done(err));
    });

    it('Aluno de outros perfis > 204', (done) => {
      request(app)
        .get(`/alunos/${idAlunoOutro}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(204)
        .then((response) => {
          assert.ok(!response.body || Object.keys(response.body).length == 0);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /alunos/exportar (Exportar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app).get(`/alunos/exportar`).expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/exportar`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .get(`/alunos/exportar`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Todos alunos > 200', (done) => {
      request(app)
        .get('/alunos/exportar')
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        .expect(
          'Content-Disposition',
          'attachment; filename="Alunos.xlsx"; filename*=utf-8\'\'Alunos.xlsx;',
        )
        .expect('Content-Length', /\d{4,}/) // exigindo no minimo 1k
        .end(done);
    });
  });

  describe('POST /alunos (Criar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app).post(`/alunos`).expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .post(`/alunos`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .post(`/alunos`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Criando aluno > 200', (done) => {
      request(app)
        .post('/alunos')
        .send(alunoValido)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          const erros = validadorJson.validarAluno(response.body);
          assert.strictEqual(erros.length, 0, JSON.stringify(erros, null, 2));
          idAlunoCriado = response.body.id;
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PUT /alunos/:_id (Alterar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/${idAlunoProprio}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Alterando item proprio > 200', (done) => {
      request(app)
        .put(`/alunos/${idAlunoProprio}`)
        .send(alunoValido)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          const erros = validadorJson.validarAluno(response.body);
          assert.strictEqual(erros.length, 0, JSON.stringify(erros, null, 2));
          assert.strictEqual(
            response.body.descricao,
            alunoValido.descricao,
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('Alterando item de outro perfil > 400', (done) => {
      request(app)
        .put(`/alunos/${idAlunoOutro}`)
        .send(alunoValido)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(
            response.body.message,
            'O registro informado não existe.',
          );
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE /alunos/:_id (Excluir)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app)
    //     .delete(`/alunos/${idAlunoProprio}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .delete(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .delete(`/alunos/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Excluíndo item próprio > 200', (done) => {
      request(app)
        .delete(`/alunos/${idAlunoProprio}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(response.body.excluidos, 1);
          done();
        })
        .catch((err) => done(err));
    });

    it('Excluíndo item de outro perfil > 200', (done) => {
      request(app)
        .delete(`/alunos/${idAlunoOutro}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(response.body.excluidos, 0);
          done();
        })
        .catch((err) => done(err));
    });

    it('Excluíndo item criado no passo anterior > 200', (done) => {
      request(app)
        .delete(`/alunos/${idAlunoCriado}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assert.strictEqual(response.body.excluidos, 1);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PUT /alunos/restaurar/:_id (Restaurar)', () => {
    // it("Sem autenticar > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/restaurar/${idAlunoProprio}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 1 > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/restaurar/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida1}`)
    //     .expect(401, done);
    // });

    // it("Token inválida 2 > 401", (done) => {
    //   request(app)
    //     .put(`/alunos/restaurar/${idAlunoProprio}`)
    //     .set("Authorization", `Bearer ${tokenInvalida2}`)
    //     .expect(401, done);
    // });

    it('Restaurando item próprio > 200', (done) => {
      request(app)
        .put(`/alunos/restaurar/${idAlunoProprio}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          assertAtributos.validarAluno(response.body);
          done();
        })
        .catch((err) => done(err));
    });

    it('Restaurando item de outro perfil > 204', (done) => {
      request(app)
        .put(`/alunos/restaurar/${idAlunoOutro}`)
        .set('Authorization', `Bearer ${getTokenAcesso()}`)
        .expect(204, done);
    });

  });
});
