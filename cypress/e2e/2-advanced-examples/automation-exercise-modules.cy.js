// describe / context - suite ou conjunto de testes em um mesmo arquivo
//it - um teste dentro de um bloco ou conjunto de testes

//describe -> Automation Exercise

//  it -> Cadastrar um usuário
//  it -> Teste abcde

/// <reference types="cypress" />

import userData from "../../fixtures/example.json";
import { getRandomNumber, getRandomEmail } from "../../support/helpers";

import { faker } from "@faker-js/faker";
import menu from "../modules/menu";
import login from "../modules/login";
import cadastro from "../modules/cadastro";


describe("Automation Exercise", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("https://automationexercise.com/");

    menu.navegarParaLogin();
  });

  it("1-Cadastrar um usuário", () => {
    login.preencherFormularioDePreCadastro();
    cadastro.Preencherformuláriodecadatrocompleto();

    //Triplo A - Arrange , Act , Assert
    cy.url().should("includes", "account_created");
    cy.contains("b", "Account Created!");
    cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

  });

  it("2-Login de Usuario com e-mail e senha corretos", () => {
    login.preencherFormularioDelogin(userData.user, userData.password);

    cy.get("i.fa-user").parent().should("contain", userData.name);
    cy.get('a[href="/logout"]').should("be.visible");

    cy.get(":nth-child(10) > a")
      .should("be.visible")
      .invoke("text")
      .then((text) => {
      expect(text.trim()).to.eq(`Logged in as ${userData.name}`);
  
    });
  });


  it("3-Login de Usuario com e-mail e/ou senha incorretos", () => {
    login.preencherFormularioDelogin(userData.user, "54321");

    cy.get(".login-form > form > p").should(
      "contain",
      "Your email or password is incorrect!"
    );
  });

  it("4-Logout de Usuario", () => {
    login.preencherFormularioDelogin(userData.user, userData.password);

    menu.efetuarLogout();

    cy.url().should("contain", "login");
    cy.contains("Login to your account");
    cy.get('a[href="/logout"]').should("not.exist");
    cy.get('a[href="/login"]').should("contain", "Signup / Login");
  });

  it("5-Cadastrar Usuário com e-mail existente no sistema", () => {
    cy.get(`[data-qa="signup-name"]`).type(`QA Tester thre"`);
    cy.get(`[data-qa="signup-email"]`).type("qatester-1759531918282@teste.com");

    cy.contains("button", "Signup").click();

    cy.get(".signup-form > form > p").should(
      "contain",
      "Email Address already exist!"
    );
  });

  it("Enviar formulário de Contato com upload de arquivo", () => {
    cy.get(`a[href*=contact]`).click();

    cy.get('[data-qa="name"]').type(userData.name);
    cy.get('[data-qa="email"]').type(userData.email);
    cy.get('[data-qa="subject"]').type(userData.subject);
    cy.get('[data-qa="message"]').type(userData.message);

    cy.fixture("example.json").as("arquivo");

    cy.get("input[type=file]").selectFile("@arquivo");

    cy.get('[data-qa="submit-button"]').click();

    //asserts
    cy.get(".status").should("be.visible");
    cy.get(".status").should(
      "have.text",
      "Success! Your details have been submitted successfully."
    );
  });
});
