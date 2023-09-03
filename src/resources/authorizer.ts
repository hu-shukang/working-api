export const CognitoAuthorizer = {
  Type: 'AWS::ApiGateway::Authorizer',
  Properties: {
    Name: 'CognitoAuthorizer-${opt:stage}',
    RestApiId: { Ref: 'ApiGatewayRestApi' },
    Type: 'COGNITO_USER_POOLS',
    IdentitySource: 'method.request.header.Authorization',
    ProviderARNs: [{ 'Fn::GetAtt': ['UserPool', 'Arn'] }]
  }
};
