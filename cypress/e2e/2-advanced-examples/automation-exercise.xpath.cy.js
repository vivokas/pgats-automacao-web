/// <reference types="cypress" />

import userData from "../../fixtures/example.json";
import { getRandomNumber, getRandomEmail } from "../../support/helpers";
import { faker } from "@faker-js/faker";

describe("Automation Exercise", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("https://automationexercise.com/");
    cy.xpath('//a[@href="/login"]').click();
  });

  //Testes
  it("1-Cadastrar um usuário", () => {
    const timestamp = new Date().getTime();

    cy.xpath('//*[@data-qa="signup-name"]').type("QA Tester thre");
    cy.xpath('//*[@data-qa="signup-email"]').type(
      `qatester-${timestamp}@teste.com`
    );
    cy.xpath('//button[contains(text(),"Signup")]').click();

    cy.xpath('//input[@type="radio" and @value="Mrs"]').check();
    cy.xpath('//input[@id="password"]').type("12345", { log: false });

    cy.xpath('//*[@data-qa="days"]').select("20");
    cy.xpath('//*[@data-qa="months"]').select("September");
    cy.xpath('//*[@data-qa="years"]').select("1990");

    cy.xpath('//input[@type="checkbox" and @id="newsletter"]').check();
    cy.xpath('//input[@type="checkbox" and @id="optin"]').check();

    cy.xpath('//input[@id="first_name"]').type(faker.person.firstName());
    cy.xpath('//input[@id="last_name"]').type(faker.person.lastName());
    cy.xpath('//input[@id="company"]').type(`PGATS ${faker.company.name()}`);
    cy.xpath('//input[@id="address1"]').type(faker.location.streetAddress());
    cy.xpath('//select[@id="country"]').select("Australia");
    cy.xpath('//input[@id="state"]').type(faker.location.state());
    cy.xpath('//input[@id="city"]').type(faker.location.city());
    cy.xpath('//*[@data-qa="zipcode"]').type(faker.location.zipCode());
    cy.xpath('//*[@data-qa="mobile_number"]').type("556 247 896");

    cy.xpath('//*[@data-qa="create-account"]').click();

    cy.url().should("include", "account_created");
    cy.contains("b", "Account Created!");
  });

  it("2-Login de Usuario com e-mail e senha corretos", () => {
    cy.xpath('//*[@data-qa="login-email"]').type(
      `qatester-1759531918282@teste.com`
    );
    cy.xpath('//*[@data-qa="login-password"]').type("12345");
    cy.xpath('//*[@data-qa="login-button"]').click();

    cy.xpath('//i[contains(@class,"fa-user")]/..').should(
      "contain",
      "QA Tester thre"
    );
  });

  it("3-Login de Usuario com e-mail e/ou senha incorretos", () => {
    cy.xpath('//*[@data-qa="login-email"]').type(
      `qatester-1759531918282@teste.com`
    );
    cy.xpath('//*[@data-qa="login-password"]').type("54321");
    cy.xpath('//*[@data-qa="login-button"]').click();

    cy.xpath('//div[@class="login-form"]/form/p').should(
      "contain",
      "Your email or password is incorrect!"
    );
  });

  it("4-Logout de Usuario", () => {
    cy.xpath('//*[@data-qa="login-email"]').type(
      `qatester-1759531918282@teste.com`
    );
    cy.xpath('//*[@data-qa="login-password"]').type("12345");
    cy.xpath('//*[@data-qa="login-button"]').click();

    cy.xpath('//i[contains(@class,"fa-user")]/..').should(
      "contain",
      "QA Tester thre"
    );
    cy.xpath('//a[@href="/logout"]').should("be.visible").click();

    cy.url().should("contain", "login");
  });

  it("5-Cadastrar Usuário com e-mail existente no sistema", () => {
    cy.xpath('//*[@data-qa="signup-name"]').type(`QA Tester thre`);
    cy.xpath('//*[@data-qa="signup-email"]').type(
      "qatester-1759531918282@teste.com"
    );
    cy.xpath('//button[contains(text(),"Signup")]').click();

    cy.xpath('//div[@class="signup-form"]/form/p').should(
      "contain",
      "Email Address already exist!"
    );
  });

  it("Enviar formulário de Contato com upload de arquivo", () => {
    cy.xpath('//a[contains(@href,"contact")]').click();

    cy.xpath('//*[@data-qa="name"]').type(userData.name);
    cy.xpath('//*[@data-qa="email"]').type(userData.email);
    cy.xpath('//*[@data-qa="subject"]').type(userData.subject);
    cy.xpath('//*[@data-qa="message"]').type(userData.message);

    cy.fixture("example.json").as("arquivo");
    cy.xpath('//input[@type="file"]').selectFile("@arquivo");

    cy.xpath('//*[@data-qa="submit-button"]').click();

    //cy.wait(4000); // espera 2s

    cy.xpath('//div[contains(@class, "status")]', { timeout: 20000 })
      .should("be.visible")
      .and(
        "contain.text",
        "Success! Your details have been submitted successfully."
      );
  });
});
