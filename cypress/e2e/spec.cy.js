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

describe('Authentication and Redirection Tests', () => {
  it('redirects unauthenticated users from / to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/'); 
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /scoreboard to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/scoreboard'); 
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /progress to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/progress'); 
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /update to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/update'); 
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /addactivity to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/addactivity'); // Replace '/scoreboard' with a protected route in your application
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /adddeletion to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/adddeduction'); // Replace '/scoreboard' with a protected route in your application
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });

  it('redirects unauthenticated users from /reset to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/reset'); // Replace '/scoreboard' with a protected route in your application
    cy.url().should('include', '/login');
    cy.contains('Sign in').should('exist');
  });




  // You can include more tests here for different scenarios or routes
});

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

describe('Post-Login Redirection Tests', () => {
  beforeEach(() => {
    // Login procedure to ensure the user is authenticated
    cy.visit('/login');
    cy.get('input[placeholder="Email Address"]').type(Cypress.env('CORRECT_USER_EMAIL'));
    cy.get('input[placeholder="Password"]').type(Cypress.env('CORRECT_USER_PASSWORD'));
    cy.contains('Sign in').click();
    // Wait for navigation to ensure the login process is complete
    cy.url().should('eq', Cypress.config().baseUrl + '/scoreboard');
  });


  it('navigates to /scoreboard when "Return home" is clicked from the error page after login', () => {
    // Navigate to the error page after the user is logged in
    cy.visit('/error');
    // Click the "Return home" button
    cy.contains('Return home').click();
    // Verify that the user is redirected to /scoreboard after clicking "Return home"
    cy.url().should('eq', Cypress.config().baseUrl + '/scoreboard');
  });

  it('navigates to /scoreboard when "Return home" is clicked from the update page after login', () => {
    // Navigate to the error page after the user is logged in
    cy.visit('/update');
    // Click the "Return home" button
    cy.contains('Return home').click();
    // Verify that the user is redirected to /scoreboard after clicking "Return home"
    cy.url().should('eq', Cypress.config().baseUrl + '/scoreboard');
  });
});

