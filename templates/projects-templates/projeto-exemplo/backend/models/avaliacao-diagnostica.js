"use strict";

module.exports = (sequelize, DataTypes) => {
  const AvaliacaoDiagnostica = sequelize.define(
    "AvaliacaoDiagnostica",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      resumo: DataTypes.STRING,
      descricao: DataTypes.STRING,
      id_tenant: DataTypes.INTEGER,
    },
    {
      underscored: true,
      paranoid: true,
      tableName: "avaliacoes_diagnosticas",
      createdAt: "dataCadastro",
      updatedAt: "dataAlteracao",
      deletedAt: "dataExclusao",
      name: {
        singular: "avaliacaoDiagnostica",
        plural: "avaliacoesDiagnosticas",
      },
    }
  );
  
  return AvaliacaoDiagnostica;
};
