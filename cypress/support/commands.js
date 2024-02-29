Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get('input[placeholder="Email Address"]').type(
    Cypress.env("CORRECT_USER_EMAIL")
  );
  cy.get('input[placeholder="Password"]').type(
    Cypress.env("CORRECT_USER_PASSWORD")
  );
  cy.contains("Sign in").click();
  // Optionally wait for something on the page that indicates the user is logged in
  cy.url().should("include", "/scoreboard"); // Adjust the URL to match your application's dashboard or landing page after login
});

Cypress.Commands.add("checkHeaderAndFooter", () => {
  cy.get("header.sc-guDLey").should("exist"); // For the footer, given its unique class
  cy.get("div.sc-ckdEwu").should("exist"); // Assuming this class is unique enough for the header
});
