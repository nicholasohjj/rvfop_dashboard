describe("Authentication and Redirection Tests", () => {
  it("redirects unauthenticated users from / to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /scoreboard to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/scoreboard");
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /progress to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/progress");
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /update to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/update");
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /addactivity to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/addactivity"); // Replace '/scoreboard' with a protected route in your application
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /adddeletion to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/adddeduction"); // Replace '/scoreboard' with a protected route in your application
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  it("redirects unauthenticated users from /reset to the login page", () => {
    // Attempt to visit a protected route
    cy.visit("/reset"); // Replace '/scoreboard' with a protected route in your application
    cy.url().should("include", "/login");
    cy.contains("Sign in").should("exist");
  });

  // You can include more tests here for different scenarios or routes
});

describe("Post-Login Redirection Tests", () => {
  beforeEach(() => {
    // Login procedure to ensure the user is authenticated
    cy.visit("/login");
    cy.get('input[placeholder="Email Address"]').type(
      Cypress.env("CORRECT_USER_EMAIL")
    );
    cy.get('input[placeholder="Password"]').type(
      Cypress.env("CORRECT_USER_PASSWORD")
    );
    cy.contains("Sign in").click();
    // Wait for navigation to ensure the login process is complete
    cy.url().should("eq", Cypress.config().baseUrl + "/scoreboard");
  });

  it('navigates to /scoreboard when "Return home" is clicked from the error page after login', () => {
    // Navigate to the error page after the user is logged in
    cy.visit("/error");
    // Click the "Return home" button
    cy.contains("Return home").click();
    // Verify that the user is redirected to /scoreboard after clicking "Return home"
    cy.url().should("eq", Cypress.config().baseUrl + "/scoreboard");

    cy.visit("/update");
    // Click the "Return home" button
    cy.contains("Return home").click();
    // Verify that the user is redirected to /scoreboard after clicking "Return home"
    cy.url().should("eq", Cypress.config().baseUrl + "/scoreboard");
  });

  it("navigates to respective pages successfully after login", () => {
    cy.visit("/progress");
    cy.url().should("eq", Cypress.config().baseUrl + "/progress");
    // Navigate to the error page after the user is logged in
    cy.visit("/adddeduction");
    cy.url().should("eq", Cypress.config().baseUrl + "/adddeduction");

    cy.visit("/addactivity");
    cy.url().should("eq", Cypress.config().baseUrl + "/addactivity");
  });
});

describe("Header and Footer Functionality Tests", () => {
  beforeEach(() => {
    // Login procedure to ensure the user is authenticated
    cy.visit("/login");
    cy.get('input[placeholder="Email Address"]').type(
      Cypress.env("CORRECT_USER_EMAIL")
    );
    cy.get('input[placeholder="Password"]').type(
      Cypress.env("CORRECT_USER_PASSWORD")
    );
    cy.contains("Sign in").click();
    // Wait for navigation to ensure the login process is complete
    cy.url().should("eq", Cypress.config().baseUrl + "/scoreboard");
  });

  it("verifies header and footer presence on multiple pages", () => {
    const routes = [
      "/scoreboard",
      "/progress",
      "/addactivity",
      "/adddeduction",
    ];
    routes.forEach((route) => {
      cy.visit(route);

      cy.get("header.sc-guDLey").should("exist"); // For the footer, given its unique class
      cy.get("div.sc-ckdEwu").should("exist"); // Assuming this class is unique enough for the header
    });
  });

  it('navigates to "My Progress" using the footer menu', () => {
    // Clicks the logo button to open the menu
    cy.get('button.sc-eDLKkx.kZouAe').click();
    // Clicks the "My Progress" menu item
    cy.get('ul.sc-gLLuof.cSDxqU').contains('My Progress').click();
    cy.url().should('include', '/progress');
  });
  
  it('navigates to "Scoreboard" using the footer menu', () => {
    // Clicks the logo button to open the menu
    cy.get('button.sc-eDLKkx.kZouAe').click();
    // Clicks the "Scoreboard" menu item
    cy.get('ul.sc-gLLuof.cSDxqU').contains('Scoreboard').click();
    cy.url().should('include', '/scoreboard');
  });

  it('logs out correctly through the footer menu', () => {
    // Clicks the logo button to open the menu
    cy.get('button.sc-eDLKkx.kZouAe').click();
    // Clicks the "Logout" menu item
    cy.get('ul.sc-gLLuof.cSDxqU').contains('Logout').click();
    // Verify redirection to login page
    cy.url().should('include', '/login');
    // Optionally, verify that the user session is terminated by attempting to navigate to a protected route and ensuring redirection back to the login page
    cy.visit('/scoreboard');
    cy.url().should('include', '/login');
  });
  
  
  

  // Additional tests for other functionalities
});
