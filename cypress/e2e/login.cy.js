describe('Login Page Tests', () => {
  beforeEach(() => {
    // Assuming your login page is at '/login'
    cy.visit('/login');
  });

  it('renders the login form', () => {
    cy.get('input[placeholder="Email Address"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.contains('Sign in').should('exist');
    cy.contains('Forgot your password?').should('exist');
  });

  it('allows the user to input email and password', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    cy.get('input[placeholder="Email Address"]').type(testEmail).should('have.value', testEmail);
    cy.get('input[placeholder="Password"]').type(testPassword).should('have.value', testPassword);
  });

  it('shows an error message on failed login', () => {
    // Simulate a failed login attempt by typing invalid credentials and submitting the form
    cy.get('input[placeholder="Email Address"]').type('wrong@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.contains('Sign in').click();

    // Adjust the following line to match how your application displays login errors
    cy.contains('⚠️').should('be.visible'); // This is a generic selector; please adjust based on your actual error display
  });

  it('redirects to the home page on successful login', () => {
    // Type valid credentials and submit the form
    // You might need to intercept and mock the network request/response here
    cy.get('input[placeholder="Email Address"]').type(Cypress.env('CORRECT_USER_EMAIL'));
    cy.get('input[placeholder="Password"]').type(Cypress.env('CORRECT_USER_PASSWORD'));
    cy.contains('Sign in').click();

    // Verify navigation to the home page after successful login
    cy.url().should('eq', Cypress.config().baseUrl + '/scoreboard');
  });

  // Add more tests as needed, such as for the "Forgot your password?" flow
});