/**
 * Where the database connection comes from:
 * 1. DATABASE_URL (mysql://user:password@host:port/database), used locally in .env.local, or
 * 2. the separate DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME variables that some hosts
 *    (e.g. GoDaddy's hosted database) inject automatically.
 * Returns null when neither is configured.
 */
export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const url = env.DATABASE_URL?.trim();
  if (url) return url;

  const host = env.DB_HOST?.trim();
  const user = env.DB_USER?.trim();
  const name = env.DB_NAME?.trim();
  if (!host || !user || !name) return null;

  const port = env.DB_PORT?.trim() || "3306";
  const password = env.DB_PASSWORD ?? "";
  const e = encodeURIComponent;
  return `mysql://${e(user)}:${e(password)}@${host}:${port}/${e(name)}`;
}
