import wildcardMatch from "wildcard-match";
import { getConfig } from "../../lib/config";

export const dynamic = "force-dynamic";

const allowedOrigins = process.env.IFRAME_ALLOWED_ORIGINS?.split(",") || [];
const checkOriginAllowed = wildcardMatch(allowedOrigins);

const verifyOrigin = (
  origin: string | null,
): { origin: string } | { response: Response } => {
  if (allowedOrigins.includes("*")) {
    // if (process.env.NODE_ENV !== "development") {
    //   throw new Error(
    //     "CORS wildcard is not allowed in production. Please specify IFRAME_ALLOWED_ORIGINS in your .env file.",
    //   );
    // }

    return {
      origin: "*",
    };
  }

  if (!origin) {
    return {
      response: new Response("Origin header is missing", {
        status: 400,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      }),
    };
  }

  const allowed = checkOriginAllowed(origin);

  if (!allowed) {
    return {
      response: new Response("Origin not allowed", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      }),
    };
  }

  return { origin };
};

export async function GET(request: Request) {
  const config = getConfig();

  const origin =
    request.headers.get("Origin") ?? request.headers.get("Referer");
  const originOrResponse = verifyOrigin(origin);

  if ("response" in originOrResponse) {
    return originOrResponse.response;
  }

  const verifiedOrigin = originOrResponse.origin;

  const body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script type="module">
          import Keycloak from "https://cdn.jsdelivr.net/npm/keycloak-js@26.2.0/+esm"
          const keycloak = new Keycloak({
            url: ${JSON.stringify(config.KEYCLOAK_PUBLIC_URL)},
            realm: ${JSON.stringify(config.KEYCLOAK_REALM)},
            clientId: ${JSON.stringify(config.KEYCLOAK_PUBLIC_CLIENT_ID)}
          });

          function sendMessage(type, data) {
            const payload = { type, data };
            console.log("Sending message to " + ${JSON.stringify(verifiedOrigin)} + ":", payload);
            window.parent.postMessage(payload, ${JSON.stringify(verifiedOrigin)});
          }

          try {
            const authenticated = await keycloak.init({
              onLoad: "check-sso",
            });
            if (authenticated) {
              console.log("User is authenticated");
            } else {
              console.log("User is not authenticated");
            }
          } catch (error) {
            console.error("Failed to initialize adapter:", error);
          }

          const url = new URL(window.location.href);
          url.pathname = url.pathname.replace(/\\/+$/, "") + "/clients";
          const headers = new Headers();
          if (keycloak.token) {
            headers.append("Authorization", "Bearer " + keycloak.token);
          }
          const response = await fetch(url.href, { headers });
          if (response.ok) {
            const clients = await response.json();
            sendMessage("usher-clients", clients);
          } else {
            sendMessage("usher-error", "Failed to fetch clients");
          }
        </script>
      </body>
    </html>
  `;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
