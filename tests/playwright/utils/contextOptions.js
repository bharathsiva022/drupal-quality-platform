export function getContextOptions(overrides = {}) {
  const username = process.env.SHIELD_USERNAME;
  const password = process.env.SHIELD_PASSWORD;

  const hasShield = username && password;

  return {
    ...(hasShield && {
      httpCredentials: {
        username,
        password
      }
    }),
    ...overrides
  };
}
