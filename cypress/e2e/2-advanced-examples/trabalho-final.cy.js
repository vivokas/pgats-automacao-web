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

  it("1-Cadastrar um usuário", () => {
    const timestamp = new Date().getTime();

    cy.get('[data-qa="signup-name"]').type("QA Tester thre");
    cy.get('[data-qa="signup-email"]').type(`qatester-${timestamp}@teste.com`);

    cy.contains("button", "Signup").click();

    cy.get("input[type=radio]").check("Mrs");

    cy.get("input#password").type("12345", { log: false });

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

  it("6 - Formulário de contato", () => {
    cy.get("header .logo img").should("be.visible");

    cy.contains("Contact us", { matchCase: false }).click();

    cy.contains("Get In Touch", { matchCase: false }).should("be.visible");

    cy.get('[data-qa="name"]').type("Viviane Teste");
    cy.get('[data-qa="email"]').type("qatester-1759531918282@teste.com");
    cy.get('[data-qa="subject"]').type(
      "Teste preenchimento formulário de contato"
    );

    cy.get('[data-qa="message"]').type("Mensagem inserida pela automação.");

    cy.fixture("example.json").as("arquivo");

    cy.get("input[type=file]").selectFile("@arquivo");

    cy.get('[data-qa="submit-button"]').click();

    cy.on("window:confirm", () => true);

    cy.contains(
      "Success! Your details have been submitted successfully."
    ).should("be.visible");

    cy.contains("Home").click();
    cy.url().should("eq", "https://automationexercise.com/");
    cy.get("header .logo img").should("be.visible");
  });

  it("8 - Verificar todos os produtos e a página de detalhes do produto", () => {
    cy.url().should("include", "automationexercise.com");
    cy.get("header").should("be.visible");

    cy.contains("Products").click();

    cy.url().should("include", "/products");
    cy.get("h2").contains("All Products").should("be.visible");

    cy.get(".features_items").should("be.visible");

    cy.get(".product-image-wrapper")
      .first()
      .find("a")
      .contains("View Product")
      .click();

    cy.url().should("include", "/product_details/");

    cy.get(".product-information").within(() => {
      cy.get("h2").should("be.visible"); 
      cy.contains("Category").should("be.visible"); 
      cy.contains("Rs").should("be.visible"); 
      cy.contains("Availability").should("be.visible"); 
      cy.contains("Condition").should("be.visible"); 
      cy.contains("Brand").should("be.visible"); 
    });
  });

  it("9 - Busca de produtos", () => {
    cy.get("header").should("be.visible");

    cy.get('a[href="/products"]').click();

    cy.get("h2.title.text-center").should("contain.text", "All Products");

    const produto = "Jeans";
    cy.get("#search_product").type(produto);
    cy.get("#submit_search").click();

    cy.get("h2.title.text-center").should("contain.text", "Searched Products");

    cy.get(".features_items .product-image-wrapper").each(($el) => {
      cy.wrap($el).should("be.visible");
    });
  });

  it("10 - Verifica assinatura página inicial", () => {
    cy.url().should("include", "automationexercise.com");
    cy.get("header").should("be.visible");

    cy.get("footer").scrollIntoView();

    cy.get(".single-widget > h2").should("be.visible");

    cy.get("#susbscribe_email").type(faker.internet.email());
    cy.get("#subscribe").click();

    cy.get(".alert-success")
      .should("be.visible")
      .and("contain.text", "You have been successfully subscribed!");
  });

  it("15 - Fazer pedido após registrar usuário e deletar usuario", () => {
    const timestamp = new Date().getTime();

    cy.get('[data-qa="signup-name"]').type("QA Tester thre");
    cy.get('[data-qa="signup-email"]').type(`qatester-${timestamp}@teste.com`);

    cy.contains("button", "Signup").click();

    cy.get("input[type=radio]").check("Mrs");

    cy.get("input#password").type("12345", { log: false });

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

    cy.url().should("includes", "account_created");
    cy.contains("b", "Account Created!");

    cy.get('[data-qa="continue-button"]').click();

    cy.contains(`Logged in as ${name}`).should("be.visible");

    cy.contains("Products").click();
    cy.url().should("include", "/products");

    cy.get(".product-image-wrapper").first().trigger("mouseover");
    cy.contains("Add to cart").click();

    cy.contains("Continue Shopping").click();

    cy.get(".product-image-wrapper").eq(1).trigger("mouseover");
    cy.contains("Add to cart").click();

    cy.contains("View Cart").click();

    cy.url().should("include", "/view_cart");
    cy.get(".active").should("contain.text", "Shopping Cart");

    cy.contains("Proceed To Checkout").click();

    cy.contains("Address Details").should("be.visible");
    cy.contains("Review Your Order").should("be.visible");

    cy.get("textarea[name='message']").type("Pedido de teste.");
    cy.contains("Place Order").click();

    cy.get('[data-qa="name-on-card"]').type(faker.person.firstName());
    cy.get('[data-qa="card-number"]').type("4111111111111111");
    cy.get('[data-qa="cvc"]').type("123");
    cy.get('[data-qa="expiry-month"]').type("12");
    cy.get('[data-qa="expiry-year"]').type("2027");

    cy.get('[data-qa="pay-button"]').click();

    cy.contains("Order Placed!").should("be.visible");

    cy.contains("Delete Account").click();
    cy.contains("Account Deleted!").should("be.visible");
    cy.get('[data-qa="continue-button"]').click();
  });
});
