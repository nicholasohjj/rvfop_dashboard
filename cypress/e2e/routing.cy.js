describe("Authentication and Redirection Tests", () => {
  const protectedRoutes = [
    "/",
    "/scoreboard",
    "/progress",
    "/update",
    "/addactivity",
    "/adddeduction",
    "/reset",
  ];

  protectedRoutes.forEach((route) => {
    it(`redirects unauthenticated users from ${route} to the login page`, () => {
      cy.visit(route);
      cy.url().should("include", "/login");
      cy.contains("Sign in").should("exist");
    });
  });
});

describe("Post-Login Redirection Tests", () => {
  beforeEach(() => {
    cy.login(); // Assuming cy.login() is a custom command for logging in
  });

  it("navigates to respective pages successfully after login", () => {
    const postLoginRoutes = [
      "/scoreboard",
      "/progress",
      "/addactivity",
      "/adddeduction",
    ];
    postLoginRoutes.forEach((route) => {
      cy.visit(route);
      cy.url().should("eq", Cypress.config().baseUrl + route);
    });
  });
});

describe("Header and Footer Functionality Tests", () => {
  beforeEach(cy.login);

  it("verifies header and footer presence on multiple pages", () => {
    const routes = [
      "/scoreboard",
      "/progress",
      "/addactivity",
      "/adddeduction",
    ];
    routes.forEach((route) => {
      cy.visit(route);
      cy.checkHeaderAndFooter();
    });
  });

  const navigationTests = [
    { title: "My Progress", route: "/progress" },
    { title: "Scoreboard", route: "/scoreboard" },
  ];

  navigationTests.forEach(({ title, route }) => {
    it(`navigates to "${title}" using the menu`, () => {
      cy.get("button.menu").click(); // Assuming you've abstracted the button with a class or data attribute
      cy.contains(title).click();
      cy.url().should("include", route);
    });
  });

  it("logs out correctly through the footer menu", () => {
    // Clicks the logo button to open the menu
    cy.get("button.sc-eDLKkx.kZouAe").click();
    // Clicks the "Logout" menu item
    cy.get("ul.sc-gLLuof.cSDxqU").contains("Logout").click();
    // Verify redirection to login page
    cy.url().should("include", "/login");
    // Optionally, verify that the user session is terminated by attempting to navigate to a protected route and ensuring redirection back to the login page
    cy.visit("/scoreboard");
    cy.url().should("include", "/login");
  });

  // Additional tests for other functionalities
});
