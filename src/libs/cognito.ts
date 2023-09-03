export const UserPool = {
  Type: "AWS::Cognito::UserPool",
  Properties: {
    UserPoolName: "working-user-pool-${env:STAGE}",
    UsernameAttributes: ["email"],
    AutoVerifiedAttributes: ["email"],
    Schema: [
      {
        Name: 'role',
        AttributeDataType: 'String',
        Mutable: true,
        Required: false,
      }
    ]

  },
};

export const UserPoolDomain = {
  Type: "AWS::Cognito::UserPoolDomain",
  Properties: {
    Domain: "working-${env:STAGE}",
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
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
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
    ClientName: "working-user-pool-client-${env:STAGE}",
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
