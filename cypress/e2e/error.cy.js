describe('Error Page Tests', () => {
  beforeEach(() => {
    // Directly visit the error page URL or trigger an error to navigate there
    cy.visit('/error'); // Adjust this URL if your error page path is different
  });

  it('displays the error message and return home button', () => {
    cy.contains('Error 404'); // Checks for the error message
    cy.contains('The page you are looking for does not exist.'); // Verifies the detailed error text
    cy.contains('Return home').should('be.visible'); // Ensures the "Return home" button is visible
  });

  it('navigates to login when "Return home" button is clicked', () => {
    cy.contains('Return home').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/login'); // This checks that the URL is the home page URL after clicking
  });
});
