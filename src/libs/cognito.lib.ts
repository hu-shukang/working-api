import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandOutput
} from '@aws-sdk/client-cognito-identity-provider';

export class CognitoLib {
  private client: CognitoIdentityProviderClient;

  constructor() {
    this.client = new CognitoIdentityProviderClient();
  }

  public async initiateAuth(provider: string, code: string): Promise<InitiateAuthCommandOutput> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: provider,
        CODE: code
      }
    });

    return await this.client.send(command);
  }
}