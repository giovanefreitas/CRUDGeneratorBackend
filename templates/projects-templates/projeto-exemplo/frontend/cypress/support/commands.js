// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  "getBySel",
  {
    prevSubject: "optional",
  },
  (subject, selector, ...args) => {
    if (subject) {
      console.log("buscando no pai...", subject);
      return cy.wrap(subject).get(`[data-test=${selector}]`, ...args);
    } else {
      console.log("buscando na raiz...");
      return cy.get(`[data-test=${selector}]`, ...args);
    }
  }
);

Cypress.Commands.add(
  "getAutocomplete",
  {
    prevSubject: "optional",
  },
  (subject, selector, ...args) => {
    if (subject) {
      return cy
        .wrap(subject)
        .get(`[data-test=${selector}]`, ...args)
        .find("input[type=text]");
    } else {
      return cy
        .get(`[data-test=${selector}]`, ...args)
        .find("input[type=text]");
    }
  }
);

Cypress.Commands.overwrite("type", (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false;
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: "type",
      message: "***************************",
    });
  }

  return originalFn(element, text, options);
});

Cypress.Commands.add("loginEmpresa1", () => {
  // cy.clearLocalStorage();
  // cy.request({
  //   method: "POST",
  //   url: "http://localhost:4000/login",
  //   body: { email: "master@gestao.vip", senha: "secret" },
  // }).then(({ body }) => {
  //   console.log(body);
  //   window.localStorage.setItem("usuario", JSON.stringify(body.usuario));
  //   window.localStorage.setItem("jwt", body.token);
  // });
});

Cypress.Commands.add("semErro", () => {
  cy.getBySel("mensagem-erro").should("be.not.exist");
});

Cypress.Commands.add("comSucesso", () => {
  cy.getBySel("mensagem-sucesso").should("be.visible");
});
