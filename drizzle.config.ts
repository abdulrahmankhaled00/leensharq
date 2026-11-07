import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolveDatabaseUrl } from "./lib/db/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    // DATABASE_URL locally; on hosts that inject DB_HOST/DB_USER/DB_PASSWORD/DB_NAME, those instead.
    url: resolveDatabaseUrl() ?? "",
  },
});
