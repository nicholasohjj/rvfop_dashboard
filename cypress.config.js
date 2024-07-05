import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    CORRECT_USER_EMAIL: process.env.CORRECT_USER_EMAIL,
    CORRECT_USER_PASSWORD: process.env.CORRECT_USER_PASSWORD,
  },
});
