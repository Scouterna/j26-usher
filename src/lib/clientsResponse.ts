export interface Client {
  id: string;
  clientId: string;
  name: string;
  rootUrl?: string;
  baseUrl?: string;
  surrogateAuthRequired: boolean;
  enabled: boolean;
  alwaysDisplayInConsole: boolean;
  clientAuthenticatorType: string;
  redirectUris: string[];
  webOrigins: string[];
  notBefore: number;
  bearerOnly: boolean;
  consentRequired: boolean;
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  publicClient: boolean;
  frontchannelLogout: boolean;
  protocol: string;
  attributes: Attributes;
  authenticationFlowBindingOverrides: unknown;
  fullScopeAllowed: boolean;
  nodeReRegistrationTimeout: number;
  defaultClientScopes: string[];
  optionalClientScopes: string[];
  access: Access;
  protocolMappers?: ProtocolMapper[];
  description?: string;
  adminUrl?: string;
  secret?: string;
  authorizationServicesEnabled?: boolean;
}

export interface Attributes {
  realm_client?: string;
  "post.logout.redirect.uris"?: string;
  "pkce.code.challenge.method"?: string;
  "client.use.lightweight.access.token.enabled"?: string;
  "client.secret.creation.time"?: string;
  "request.object.signature.alg"?: string;
  "request.object.encryption.alg"?: string;
  "client.introspection.response.allow.jwt.claim.enabled"?: string;
  "standard.token.exchange.enabled"?: string;
  "frontchannel.logout.session.required"?: string;
  "oauth2.device.authorization.grant.enabled"?: string;
  logoUri?: string;
  "backchannel.logout.revoke.offline.tokens"?: string;
  "use.refresh.tokens"?: string;
  "oidc.ciba.grant.enabled"?: string;
  "backchannel.logout.session.required"?: string;
  "request.object.required"?: string;
  "client_credentials.use_refresh_token"?: string;
  "access.token.header.type.rfc9068"?: string;
  "tls.client.certificate.bound.access.tokens"?: string;
  "require.pushed.authorization.requests"?: string;
  "acr.loa.map"?: string;
  "display.on.consent.screen"?: string;
  "request.object.encryption.enc"?: string;
  "token.response.type.bearer.lower-case"?: string;
}

export interface Access {
  view: boolean;
  configure: boolean;
  manage: boolean;
}

export interface ProtocolMapper {
  id: string;
  name: string;
  protocol: string;
  protocolMapper: string;
  consentRequired: boolean;
  config: ProtocolMapperConfig;
}

export interface ProtocolMapperConfig {
  "introspection.token.claim"?: string;
  "userinfo.token.claim"?: string;
  "user.attribute"?: string;
  "id.token.claim"?: string;
  "access.token.claim"?: string;
  "claim.name"?: string;
  "jsonType.label"?: string;
}
