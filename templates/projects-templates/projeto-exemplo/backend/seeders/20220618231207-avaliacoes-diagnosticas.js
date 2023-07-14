"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const avaliacoes = [
      {
        id: 1,
        resumo: "Teste",
        descricao: "Teste",
        data_cadastro: new Date(),
        data_alteracao: new Date(),
        id_tenant: 1,
      },
    ];

    await queryInterface.bulkInsert("avaliacoes_diagnosticas", avaliacoes, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
