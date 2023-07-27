import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  driver: "mysql2",
  breakpoints: true,
} satisfies Config;
