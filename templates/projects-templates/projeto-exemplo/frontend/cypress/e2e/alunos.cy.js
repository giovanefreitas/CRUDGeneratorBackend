/// <reference types="cypress" />

// Veja a documentação do Cypress em:
// https://on.cypress.io/introduction-to-cypress

describe("Testando cadastro de aluno", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  // it("Sem autenticar", () => {
  //   cy.visit("/alunos");
  //   cy.getBySel("menu-lateral-logado")
  //     .should("be.not.exist")
  //     .url()
  //     .should("include", "/login");
  //   cy.semErro();
  // });

  it("Listando alunos", () => {
    cy.loginEmpresa1();
    cy.intercept("/alunos").as("listar");
    cy.visit("/alunos");
    cy.getBySel("menu-lateral-logado").should("be.visible");
    cy.wait("@listar")
    cy.getBySel("checkbox-seleciona-registro").should("have.length", 10);
    cy.semErro();
  });

  it("Criando novo aluno", () => {
    cy.loginEmpresa1();
    cy.visit("/alunos");
    cy.getBySel("novo-registro").should("be.visible").click({ force: true });

    cy.getBySel("input-nome").type("Teste com cypress");
    cy.getBySel("input-codigoNacional").type("11111111111");
    cy.getBySel("input-email").type("teste@com.cypress.io");
    //cy.getBySel('input-descricao').type("Teste com cypress{enter}Com mais{enter}De uma linha").should("have.value", "Teste com cypress\nCom mais\nDe uma linha");
    // cy.getBySel("input-cep").type("31741545");
    // cy.getBySel("input-logradouro").should(
    //   "have.value",
    //   "Rua Nair Pentagna Guimarães"
    // );

    cy.intercept("POST", "/alunos").as("inserir");

    cy.getBySel("botao-gravar").click();
    cy.wait("@inserir").semErro().comSucesso();
  });
});
