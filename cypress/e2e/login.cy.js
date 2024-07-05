describe("Login Page Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
    // Define aliases for elements
    cy.get('input[placeholder="Email Address"]').as("emailInput");
    cy.get('input[placeholder="Password"]').as("passwordInput");
    cy.contains("Sign in").as("signInButton");
  });

  it("renders the login form", () => {
    cy.get("@emailInput").should("exist");
    cy.get("@passwordInput").should("exist");
    cy.get("@signInButton").should("exist");
    cy.contains("Forgot your password?").should("exist");
  });

  it("allows the user to input email and password", () => {
    const testEmail = "test@example.com";
    const testPassword = "password123";

    cy.get("@emailInput").type(testEmail).should("have.value", testEmail);
    cy.get("@passwordInput")
      .type(testPassword)
      .should("have.value", testPassword);
  });

  it("shows an error message on failed login", () => {
    cy.get("@emailInput").type("wrong@example.com");
    cy.get("@passwordInput").type("wrongpassword");
    cy.get("@signInButton").click();

    // Use a specific selector or text for the error message
    cy.contains("Invalid login credentials").should("be.visible");
  });

  it("displays an error when trying to login with no input", () => {
    cy.get("@signInButton").click();
    // Specific messages for empty fields
    cy.contains("Invalid login credentials").should("be.visible");
  });

  it("initiates password reset flow but shows an error for no email input", () => {
    cy.contains("Forgot your password?").click();
    cy.contains("Password recovery requires an email").should("be.visible");
  });

  it("redirects to the home page on successful login", () => {
    cy.get("@emailInput").type(Cypress.env("CORRECT_USER_EMAIL"));
    cy.get("@passwordInput").type(Cypress.env("CORRECT_USER_PASSWORD"));
    cy.get("@signInButton").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/scoreboard");
  });

  // Add more tests as needed, such as for the "Forgot your password?" flow
});
