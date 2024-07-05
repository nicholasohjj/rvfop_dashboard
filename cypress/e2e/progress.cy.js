describe("Scoreboard Tests", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept("GET", "/api/group", { fixture: "group.json" }).as(
      "fetchGroup"
    );
    cy.intercept("GET", "/api/groupActivities", {
      fixture: "activities.json",
    }).as("fetchGroupActivities");
    cy.visit("/progress");
  });

  it("displays fetched group and activity data correctly", () => {
    cy.wait("@fetchGroup");
    cy.wait("@fetchGroupActivities");
    cy.contains("Total Points Earned"); // Checking for presence of group data.
    cy.get("table").find("tr").its("length").should("be.gt", 1); // Assuming there's at least one activity.
  });

  it("opens and closes the activity detail modal", () => {
    cy.contains("View").first().click();
    cy.contains("Description"); // Assuming modal contains "Description" label.
    cy.get("[data-cy=close-modal]").click(); // Assuming you've added `data-cy` attributes for easier targeting.
    cy.get("div.modal").should("not.exist"); // Assuming modal has a class "modal".
  });

  it("adjusts layout on window resize", () => {
    cy.viewport(320, 480); // Set to a small screen size.
    cy.get(".window").should("have.css", "width", "90%"); // Assuming ".window" class is used for styling.
  });
});
