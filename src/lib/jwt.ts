import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { getConfig } from "./config";

let jwksClient: JwksClient;

export async function verifyToken(token: string) {
  if (!jwksClient) {
    const config = getConfig();
    jwksClient = new JwksClient({
      jwksUri: `${config.KEYCLOAK_ADMIN_URL}/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
    });
  }

  return new Promise<string | jwt.JwtPayload | undefined>((resolve, reject) => {
    jwt.verify(
      token,
      (header, callback) => {
        jwksClient.getSigningKey(header.kid, (err, key) => {
          callback(err, key?.getPublicKey());
        });
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      },
    );
  });
}
