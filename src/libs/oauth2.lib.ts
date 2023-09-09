import { Credentials, OAuth2Client, TokenPayload } from 'google-auth-library';

export class OAuth2Lib {
  private oauth2Client: OAuth2Client;

  constructor(clientId: string, clientSecret: string) {
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, 'http://localhost:3000');
  }

  public async getToken(code: string): Promise<Credentials> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  public async getPayload(idToken: string): Promise<TokenPayload> {
    const ticket = await this.oauth2Client.verifyIdToken({ idToken: idToken });
    return ticket.getPayload();
  }
}
