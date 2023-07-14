const lodash = require('lodash');
const assert = require('assert');
const Ajv = require('ajv');
const addFormats = require('ajv-formats').default;

const schemaAvaliacaoDiagnostica = {
  $id: '#/schemas/avaliacao-diagnostica',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    resumo: { type: 'string' },
    descricao: { type: 'string', nullable: true },
    dataCadastro: { type: 'string', format: 'date-time' },
    dataAlteracao: { type: 'string', format: 'date-time' },
    dataExclusao: { type: 'string', nullable: true, format: 'date-time' },
    id_tenant: { type: 'integer' },
    id_produto: { type: 'integer' },
    id_usuario: { type: 'integer' },
    id_avaliador: { type: 'integer', nullable: true },
    id_endereco: { type: 'integer' },
    id_tenant: { type: 'integer' },
    id_aluno: { type: 'integer' },
    endereco: { $ref: '#/schemas/endereco' },
    aluno: {
      oneOf: [{ type: 'integer' }, { $ref: '#/schemas/aluno' }],
    },
    tecnico: {
      oneOf: [{ type: 'integer' }, { $ref: '#/schemas/tecnico' }],
    },
  },
  required: [
    'resumo',
  ],
  additionalProperties: false,
};

const ajv = new Ajv({
  allErrors: true,
  schemas: [
    schemaAvaliacaoDiagnostica,
  ],
});

addFormats(ajv);

const assertAtributos = {

  validarAvaliacaoDiagnostica(avaliacaoDiagnostica) {
    const validate = ajv.compile(schemaAvaliacaoDiagnostica);
    const valid = validate(avaliacaoDiagnostica);
    if (valid) {
      return [];
    }
    return validate.errors;
  },

};

module.exports = assertAtributos;
