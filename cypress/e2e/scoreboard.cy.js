describe("Scoreboard Tests", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/scoreboard"); // Assuming cy.login() is a custom command for logging in
  });

  it("renders the loading state and then the scoreboard", () => {
    cy.contains("Scoreboard").should("be.visible");
    cy.contains("House").should("be.visible");
    cy.contains("Points").should("be.visible");
    // Wait for the houses data to load
    // cy.wait('@getHouses');
    cy.get("tbody tr").should("have.length.greaterThan", 0); // Verify that at least one row is rendered
  });

  it("loads and displays house data correctly", () => {
    const houses = [
      "Orcaella",
      "Manis",
      "Panthera",
      "Strix",
      "Rusa",
      "Chelonia",
      "Aonyx",
    ];

    // Wait for the data to load if using intercepts
    // cy.wait('@getHouses');
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.get("td")
          .first()
          .then(($td) => {
            // Check if the text of the first td is one of the houses
            expect(houses).to.include($td.text());
          });

        cy.get("td")
          .eq(1)
          .invoke("text")
          .then((text) => {
            // Convert the points to a number and check if it's >= 0
            const points = Number(text);
            expect(points).to.be.at.least(0);
          });
      });
  });

  it("loads the house with the highest points first", () => {
    // Assuming you've set up an intercept to mock the response with known data
    // cy.wait('@getHouses');

    // Get all the points from the rows in the table and store them in an array
    cy.get("tbody tr td:nth-child(2)").then(($tds) => {
      // Use .map() to extract the text content (points) from each td and parse them as numbers
      const points = [...$tds].map((el) => parseInt(el.innerText));

      // Assert that the first item in the array (the points of the first house)
      // is the highest number in the array
      expect(points[0]).to.equal(Math.max(...points));
    });
  });
});
