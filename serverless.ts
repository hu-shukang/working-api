import type { AWS } from '@serverless/typescript';
import { WorkingTable } from '@resources/dynamodb';
import { getToken } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'working-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-northeast-1',
    deploymentBucket: { name: 'working-api-deploy' },
    role: '${env:LAMBDA_ROLE}',
    apiGateway: {
      stage: 'api',
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    }
  },
  resources: {
    Resources: {
      // DynamoDB
      WorkingTable
    }
  },
  // import the function via paths
  functions: { getToken },
  layers: {
    common: {
      path: 'src/layers/common_layer',
      description: 'common layer'
    }
  },
  package: { individually: true, exclude: ['src/layers/**'] },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      external: ['*'],
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
