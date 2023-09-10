import { Credentials, OAuth2Client, TokenPayload } from 'google-auth-library';

export class OAuth2Lib {
  private oauth2Client: OAuth2Client;

  constructor(clientId: string, clientSecret: string) {
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, 'http://localhost:3000');
  }

  public async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return this.formatCredentials(tokens);
  }

  public async getPayload(idToken: string): Promise<TokenPayload> {
    const ticket = await this.oauth2Client.verifyIdToken({ idToken: idToken });
    return ticket.getPayload();
  }

  public async refreshTokens(idToken: string, refreshToken: string) {
    this.oauth2Client.setCredentials({
      id_token: idToken,
      refresh_token: refreshToken
    });
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return this.formatCredentials(credentials);
  }

  private formatCredentials(credentials: Credentials) {
    return {
      accessToken: credentials.access_token,
      idToken: credentials.id_token,
      refreshToken: credentials.refresh_token,
      tokenType: credentials.token_type,
      expiryDate: credentials.expiry_date,
      scope: credentials.scope
    };
  }
}
