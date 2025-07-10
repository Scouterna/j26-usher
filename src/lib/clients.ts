import { createCache } from "./cache";
import type { Client } from "./clientsResponse";
import { getConfig } from "./config";

type SimplifiedClient = {
  id: string;
  url: string;
  name: string;
  alwaysShow: boolean;
  logoUrl: string | null;
};

const CACHE_KEY = "clients";
const clientCache = createCache<SimplifiedClient[]>(10 * 1000); // Cache for 10 seconds

async function getAccessToken() {
  const config = getConfig();

  const response = await fetch(
    `${config.KEYCLOAK_PUBLIC_URL}/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.KEYCLOAK_ADMIN_CLIENT_ID,
        client_secret: config.KEYCLOAK_ADMIN_CLIENT_SECRET,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch access token: ${response.status} - ${response.statusText}`,
    );
  }

  const { access_token } = await response.json();

  // TODO: Handle errors, e.g., if the response is not OK or access_token is missing

  return access_token;
}

export async function fetchRawClients() {
  const config = getConfig();

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${config.KEYCLOAK_ADMIN_URL}/admin/realms/${config.KEYCLOAK_REALM}/clients`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch clients: ${response.status} - ${response.statusText}`,
    );
  }

  const data: Client[] = await response.json();

  return data;
}

function getClientURL(client: Client) {
  if (!client.baseUrl) {
    return null;
  }

  try {
    const url = new URL(client.baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    // Ensure the URL is absolute
    if (!url.host) {
      return null;
    }

    // Reconstruct the URL to ensure it has a valid format
    return url.toString();
  } catch (_) {
    return null;
  }
}

export async function getClients(): Promise<SimplifiedClient[]> {
  const cachedClients = clientCache.get(CACHE_KEY);
  if (cachedClients) {
    return cachedClients;
  }

  const clients = await fetchRawClients();
  // console.log(JSON.stringify(clients));

  const simplifiedClients = clients
    .map((client) => {
      const url = getClientURL(client);
      if (!url) return null;

      return {
        id: client.clientId,
        url,
        alwaysShow: client.alwaysDisplayInConsole ?? false,
        name: client.name || client.clientId || "Unnamed App",
        logoUrl: client.attributes.logoUri ?? null,
      } satisfies SimplifiedClient;
    })
    .filter((client) => client != null);

  clientCache.set(CACHE_KEY, simplifiedClients);

  return simplifiedClients;
}
