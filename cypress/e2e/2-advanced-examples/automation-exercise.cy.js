// describe / context - suite ou conjunto de testes em um mesmo arquivo
//it - um teste dentro de um bloco ou conjunto de testes

//describe -> Automation Exercise

//  it -> Cadastrar um usuário
//  it -> Teste abcde

/// <reference types="cypress" />

import userData from "../../fixtures/example.json";
import { getRandomNumber, getRandomEmail } from "../../support/helpers";

import { faker } from "@faker-js/faker";

describe("Automation Exercise", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("https://automationexercise.com/");
    cy.get('a[href="/login"]').click();
  });

  it("Exemplos de Logs", () => {
    cy.log("Pgats testes log");
    cy.log("STEP 1 :: PGATS AUTOMACAO WEB CY LOG");
    cy.log("STEP 2:: PGATS AUTOMACAO WEB CY LOG");

    cy.log(`getRandomNumber': ${getRandomNumber()}`)
    cy.log(`getRandomEmail': ${getRandomEmail()}`)

    //raça
    cy.log(`Dog Breed: ${ faker.animal.dog() }`)
    cy.log(`Cat Breed: ${ faker.animal.cat() }`)

    cy.log(`FullName: ${ faker.person.fullName() }`)
    cy.log(`CompanyName: ${ faker.company.name() }`)
    

    cy.log(`Nome do usuario:  ${userData.name}`);
    cy.log(`Email do usuario:  ${userData.name}`);

    console.log("PGATS AUTOMACAO CONSOLE LOG");
  });

  it("1-Cadastrar um usuário", () => {
    const timestamp = new Date().getTime();

    cy.get('[data-qa="signup-name"]').type("QA Tester thre");
    cy.get('[data-qa="signup-email"]').type(`qatester-${timestamp}@teste.com`);

    cy.contains("button", "Signup").click();

    //radio ou checkboxes -> check
    //cy.get('#id_gender2').check() para selecionar o botão certo
    cy.get("input[type=radio]").check("Mrs");

    cy.get("input#password").type("12345", { log: false });

    //para comboboxes ou selects -> select
    cy.get("[data-qa=days]").select("20");
    cy.get("[data-qa=months]").select("September");
    cy.get("[data-qa=years]").select("1990");

    cy.get("input[type=checkbox]#newsletter").check();
    cy.get("input[type=checkbox]#optin").check();

    cy.get("input#first_name").type(faker.person.firstName());
    cy.get("input#last_name").type(faker.person.lastName());
    cy.get("input#company").type(`PGATS ${faker.company.name()}`);
    cy.get("input#address1").type(faker.location.streetAddress());
    cy.get("select#country").select("Australia");
    cy.get("input#state").type(faker.location.state());
    cy.get("input#city").type(faker.location.city());
    cy.get('[data-qa="zipcode"]').type(faker.location.zipCode());
    cy.get('[data-qa="mobile_number"]').type("556 247 896");

    cy.get('[data-qa="create-account"]').click();

    //Triplo A - Arrange , Act , Assert
    cy.url().should("includes", "account_created");
    cy.contains("b", "Account Created!");
  });

  it("2-Login de Usuario com e-mail e senha corretos", () => {
    cy.get(`[data-qa="login-email"]`).type(`qatester-1759531918282@teste.com`);
    cy.get(`[data-qa="login-password"]`).type("12345");

    cy.get(`[data-qa="login-button"]`).click();

    cy.get("i.fa-user").parent().should("contain", "QA Tester thre");
  });

  it("3-Login de Usuario com e-mail e/ou senha incorretos", () => {
    cy.get(`[data-qa="login-email"]`).type(`qatester-1759531918282@teste.com`);
    cy.get(`[data-qa="login-password"]`).type("54321");

    cy.get(`[data-qa="login-button"]`).click();

    cy.get(".login-form > form > p").should(
      "contain",
      "Your email or password is incorrect!"
    );
  });

  it("4-Logout de Usuario", () => {
    cy.get(`[data-qa="login-email"]`).type(`qatester-1759531918282@teste.com`);
    cy.get(`[data-qa="login-password"]`).type("12345");

    cy.get(`[data-qa="login-button"]`).click();

    cy.get("i.fa-user").parent().should("contain", "QA Tester thre");
    cy.get('a[href="/logout"]').should("be.visible").click();

    cy.url().should("contain", "login");

    //cy.url().should("include", 'automationexercise');
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
    //cy.get('[name="upload_file"]').selectFile('cypress/fixtures/example.json')
    //cy.get('[name="upload_file"]').selectFile('@arquivo')

    cy.get('[data-qa="submit-button"]').click();

    //asserts
    cy.get(".status").should("be.visible");
    cy.get(".status").should(
      "have.text",
      "Success! Your details have been submitted successfully."
    );
  });
});
