export const UserPool = {
  Type: "AWS::Cognito::UserPool",
  Properties: {
    UserPoolName: "UserPool-${self:custom.stage}",
    UsernameAttributes: ["email"],
    AutoVerifiedAttributes: ["email"],
    DeletionProtection: "ACTIVE",
  },
};

export const UserPoolDomain = {
  Type: "AWS::Cognito::UserPoolDomain",
  Properties: {
    Domain: "working-api-${self:custom.stage}",
    UserPoolId: {
      Ref: "UserPool",
    },
  },
};

export const UserPoolIdentityProvider = {
  Type: "AWS::Cognito::UserPoolIdentityProvider",
  Properties: {
    ProviderName: "Google",
    ProviderType: "Google",
    ProviderDetails: {
      client_id: "${self:custom.googleClientId}",
      client_secret: "${self:custom.googleClientSecret}",
      authorize_scopes: "email profile openid",
    },
    AttributeMapping: {
      email: "email",
      family_name: "family_name",
      given_name: "given_name",
      email_verified: "email_verified",
      picture: "picture",
    },
    UserPoolId: {
      Ref: "UserPool",
    },
  },
};

export const UserPoolClient = {
  Type: "AWS::Cognito::UserPoolClient",
  DependsOn: ["UserPoolIdentityProvider"],
  Properties: {
    ClientName: "UserPoolClient-${self:custom.stage}",
    GenerateSecret: false,
    UserPoolId: {
      Ref: "UserPool",
    },
    SupportedIdentityProviders: ["Google"],
    AllowedOAuthScopes: ["email", "profile", "openid"],
    AllowedOAuthFlows: ["implicit"],
    AllowedOAuthFlowsUserPoolClient: true,
    AccessTokenValidity: 1,
    IdTokenValidity: 24,
    RefreshTokenValidity: 30,
    TokenValidityUnits: {
      AccessToken: "hours",
      IdToken: "hours",
      RefreshToken: "days",
    },
    CallbackURLs: [
      "http://localhost:3000",
    ],
    LogoutURLs: [
      "http://localhost:3000",
    ],
  },
};
