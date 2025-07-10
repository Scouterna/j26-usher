import { getClients } from "../../../lib/clients";
import { verifyToken } from "../../../lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer /, "");

  let userClientIDs: string[] = [];
  if (token) {
    try {
      const payload = await verifyToken(token);
      if (typeof payload === "object" && payload !== null) {
        userClientIDs = Object.keys(payload.resource_access ?? {});
      }
    } catch (_) {}
  }

  const clients = await getClients();

  const userClients = clients.filter(
    (client) => userClientIDs.includes(client.id) || client.alwaysShow,
  );

  return new Response(JSON.stringify(userClients), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
