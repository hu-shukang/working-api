export const UserPool = {
  Type: 'AWS::Cognito::UserPool',
  Properties: {
    UserPoolName: 'working-user-pool-${opt:stage}',
    UsernameAttributes: ['email'],
    AutoVerifiedAttributes: ['email'],
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: true
    },
    Schema: [
      {
        Name: 'email',
        AttributeDataType: 'String',
        Mutable: true,
        Required: true
      },
      {
        Name: 'family_name',
        AttributeDataType: 'String',
        Mutable: true,
        Required: true
      },
      {
        Name: 'given_name',
        AttributeDataType: 'String',
        Mutable: true,
        Required: true
      },
      {
        Name: 'picture',
        AttributeDataType: 'String',
        Mutable: true,
        Required: true
      },
      {
        Name: 'role',
        AttributeDataType: 'String',
        Mutable: true,
        Required: false
      }
    ]
  }
};

export const UserPoolDomain = {
  Type: 'AWS::Cognito::UserPoolDomain',
  Properties: {
    Domain: 'working-${opt:stage}',
    UserPoolId: {
      Ref: 'UserPool'
    }
  }
};

export const UserPoolIdentityProvider = {
  Type: 'AWS::Cognito::UserPoolIdentityProvider',
  Properties: {
    ProviderName: 'Google',
    ProviderType: 'Google',
    ProviderDetails: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      authorize_scopes: 'email profile openid'
    },
    AttributeMapping: {
      email: 'email',
      family_name: 'family_name',
      given_name: 'given_name',
      email_verified: 'email_verified',
      picture: 'picture'
    },
    UserPoolId: {
      Ref: 'UserPool'
    }
  }
};

export const UserPoolClient = {
  Type: 'AWS::Cognito::UserPoolClient',
  DependsOn: ['UserPoolIdentityProvider'],
  Properties: {
    ClientName: 'working-user-pool-client-${opt:stage}',
    GenerateSecret: false,
    UserPoolId: {
      Ref: 'UserPool'
    },
    ExplicitAuthFlows: [],
    SupportedIdentityProviders: ['Google'],
    AllowedOAuthScopes: ['email', 'profile', 'openid'],
    AllowedOAuthFlows: ['implicit'],
    AllowedOAuthFlowsUserPoolClient: true,
    AccessTokenValidity: 1,
    IdTokenValidity: 24,
    RefreshTokenValidity: 30,
    TokenValidityUnits: {
      AccessToken: 'hours',
      IdToken: 'hours',
      RefreshToken: 'days'
    },
    CallbackURLs: ['http://localhost:3000'],
    LogoutURLs: ['http://localhost:3000']
  }
};
