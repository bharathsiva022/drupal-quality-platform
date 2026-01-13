import path from "path";

const BASE = process.cwd();

export const ALLOWED_PATHS = [
  path.resolve(BASE, "../config/sync"),
  path.resolve(BASE, "./reports"),
  path.resolve(BASE, "./artifacts")
];

export function assertAllowed(targetPath) {
  const resolved = path.resolve(targetPath);

  const allowed = ALLOWED_PATHS.some(p =>
    resolved.startsWith(p)
  );

  if (!allowed) {
    throw new Error(`Access denied: ${resolved}`);
  }

  return resolved;
}
