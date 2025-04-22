import { defineConfig } from "drizzle-kit";
import { getDatabaseConfig } from "./config/database";

const dbConfig = getDatabaseConfig();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbConfig.url,
  },
});
