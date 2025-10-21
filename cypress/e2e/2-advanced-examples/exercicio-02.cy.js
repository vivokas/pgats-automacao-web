describe("Cadastrar entradas e saídas com bugs", () => {
  beforeEach(() => {
    cy.visit("https://devfinance-agilizei.netlify.app");
  });
  it("Cadastrar uma nova transação de entrada - falha 1", () => {
    //arrange, act, assert

    cy.visit("https://devfinance-agilizei.netlify.app");

    cy.contains("Nova Transação").click();
    cy.get("#description").type("Mesada");
    cy.get("#amount").type(100);
    cy.get("#date").type("2023-02-01");

    cy.contains("Salvar").click();

    cy.get("tbody tr").should("have.length", 1);
  });

  it("Cadastrar uma nova transação de entrada - falha 2", () => {
    cy.visit("https://devfinance-agilizei.netlify.app");

    cy.contains("Nova Transação").click();
    cy.get("#description").type("Mesada");
    cy.get("#amount").type(100);
    cy.get("#date").type("2023-02-01");

    cy.contains("Salvar").click();

    cy.get("tbody tr").should("have.length", 1);
  });

  it(
    "Cadastrar uma nova transação de entrada - falha 3",
    { defaultCommandTimeout: 10000 },
    () => {
      cy.visit("https://devfinance-agilizei.netlify.app");

      cy.contains("Nova Transação").click();
      cy.get("#description").type("Mesada");
      cy.get("#amount").type(100);

      cy.get("#date").type("2023-02-01");

      cy.contains("Salvar").click();

      cy.get("tbody tr").should("have.length", 1);
    }
  );

  //PAROU AQUI
  it("Cadastrar uma nova transação de entrada - falha 4", () => {
    cy.visit("https://devfinance-agilizei.netlify.app");

    cy.contains("Nova Transação").click();

    cy.get("#amount").type(100);
    cy.get("#description").type("Mesada");
    cy.get("#date").type("2023-02-01");
    cy.contains("Salvar").click();

    cy.get("tbody tr").should("have.length", 1);
  });

  it("Cadastrar uma nova transação de entrada - falha 5", () => {
    cy.visit("https://devfinance-agilizei.netlify.app");

    cy.contains("Nova Transação").click();
    cy.get("#description").type("Mesada");
    cy.get("#amount").type(100);
    cy.get("#date").type("2023-02-01");

    cy.contains("Salvar").click();

    //cy.get(".alert").should("not.exist");
  });

  it("Cadastrar uma nova transação de entrada - falha 6", () => {
    cy.visit("https://devfinance-agilizei.netlify.app");

    cy.contains("Nova Transação").click();
    cy.get("#description").type("Mesada");
    cy.get("#amount").type(100);
    cy.get("#date").type("2023-02-01");

    cy.contains("Salvar").click();

    cy.get("tbody tr").should("have.length", 1);
  });
});
