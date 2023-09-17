import { SSMClient, GetParametersCommand, Parameter, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Const } from './const.util';

export class ParameterUtil {
  private client: SSMClient;

  constructor() {
    this.client = new SSMClient();
  }

  public async getGoogleClientParameter() {
    const names = [Const.GOOGLE_CLIENT_ID_NAME, Const.GOOGLE_CLIENT_SECRET_NAME];
    const [clientIdParam, clientSecretParam] = await this.getParameters(names);
    return {
      clientId: clientIdParam.Value,
      clientSecret: clientSecretParam.Value
    };
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
