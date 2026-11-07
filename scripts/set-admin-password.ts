/**
 * Sets the dashboard login in .env.local (local development only).
 *
 *   npm run admin:password -- "your-new-password"
 *   npm run admin:password -- "your-new-password" new-username
 *
 * Stores a bcrypt hash (never the password itself) as ADMIN_PASSWORD_HASH, with the "$" signs
 * escaped as .env files require, and creates a SESSION_SECRET if there isn't a valid one.
 * Restart `npm run dev` afterwards (or wait for it to reload .env.local).
 */
import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import bcrypt from "bcryptjs";

const [password, username] = process.argv.slice(2);
if (!password || password.length < 10) {
  console.error('Usage: npm run admin:password -- "new-password" [username]\nThe password must be at least 10 characters.');
  process.exit(1);
}

const file = ".env.local";
let env = existsSync(file) ? readFileSync(file, "utf8") : "";

function setVar(key: string, value: string) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  env = re.test(env) ? env.replace(re, () => line) : `${env.replace(/\n?$/, "\n")}${line}\n`;
}
const current = (key: string) => env.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim() ?? "";

if (username) setVar("ADMIN_USERNAME", username);
if (!current("ADMIN_USERNAME")) {
  console.error("No ADMIN_USERNAME in .env.local yet. Pass one: npm run admin:password -- \"new-password\" your-username");
  process.exit(1);
}
setVar("ADMIN_PASSWORD_HASH", bcrypt.hashSync(password, 12).replace(/\$/g, "\\$"));
if (current("SESSION_SECRET").length < 32) setVar("SESSION_SECRET", randomBytes(32).toString("hex"));

writeFileSync(file, env);
console.log(`Dashboard login updated in .env.local for "${current("ADMIN_USERNAME")}". Sign in at /admin/login.`);
