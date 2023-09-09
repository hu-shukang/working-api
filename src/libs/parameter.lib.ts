import { SSMClient, GetParametersCommand, Parameter, GetParameterCommand } from '@aws-sdk/client-ssm';

export class ParameterLib {
  private client: SSMClient;

  constructor() {
    this.client = new SSMClient();
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
