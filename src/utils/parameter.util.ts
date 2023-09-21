import { SSMClient, GetParametersCommand, Parameter, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Const } from './const.util';

export class ParameterUtil {
  private client: SSMClient;

  constructor() {
    this.client = new SSMClient();
  }

  public async getOAuth2Parameters() {
    const names = [Const.GOOGLE_CLIENT_ID_NAME, Const.GOOGLE_CLIENT_SECRET_NAME, Const.JWT_SECRET_NAME];
    const [p1, p2, p3] = await this.getParameters(names);
    return {
      googleClientId: p1.Value,
      googleClientSecret: p2.Value,
      jwtSecret: p3.Value
    };
  }

  public async getJwtSecret() {
    const parameter = await this.getParameter(Const.JWT_SECRET_NAME);
    return parameter.Value;
  }

  public async getParameters(names: string[]): Promise<Parameter[]> {
    const command = new GetParametersCommand({
      Names: names,
      WithDecryption: true
    });
    const response = await this.client.send(command);
    return response.Parameters;
  }

  public async getParameter(name: string): Promise<Parameter> {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });
    const response = await this.client.send(command);
    return response.Parameter;
  }
}
