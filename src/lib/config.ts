type Config = {
  KEYCLOAK_REALM: string;
  KEYCLOAK_PUBLIC_URL: string;
  KEYCLOAK_PUBLIC_CLIENT_ID: string;
  KEYCLOAK_ADMIN_URL: string;
  KEYCLOAK_ADMIN_CLIENT_ID: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
};

let config: Config | null = null;

export function getConfig(): Config {
  if (config) {
    return config;
  }

  if (!process.env.KEYCLOAK_REALM)
    throw new Error("Environment variable KEYCLOAK_REALM is not set");
  if (!process.env.KEYCLOAK_PUBLIC_URL)
    throw new Error("Environment variable KEYCLOAK_PUBLIC_URL is not set");
  if (!process.env.KEYCLOAK_PUBLIC_CLIENT_ID)
    throw new Error(
      "Environment variable KEYCLOAK_PUBLIC_CLIENT_ID is not set",
    );
  if (!process.env.KEYCLOAK_ADMIN_URL)
    throw new Error("Environment variable KEYCLOAK_ADMIN_URL is not set");
  if (!process.env.KEYCLOAK_ADMIN_CLIENT_ID)
    throw new Error("Environment variable KEYCLOAK_ADMIN_CLIENT_ID is not set");
  if (!process.env.KEYCLOAK_ADMIN_CLIENT_SECRET)
    throw new Error(
      "Environment variable KEYCLOAK_ADMIN_CLIENT_SECRET is not set",
    );

  config = {
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_PUBLIC_URL: process.env.KEYCLOAK_PUBLIC_URL,
    KEYCLOAK_PUBLIC_CLIENT_ID: process.env.KEYCLOAK_PUBLIC_CLIENT_ID,
    KEYCLOAK_ADMIN_URL: process.env.KEYCLOAK_ADMIN_URL,
    KEYCLOAK_ADMIN_CLIENT_ID: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
    KEYCLOAK_ADMIN_CLIENT_SECRET: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
  };

  return config;
}
