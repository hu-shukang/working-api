import type { AWS } from '@serverless/typescript';
import { UserPool, UserPoolClient, UserPoolDomain, UserPoolIdentityProvider } from "@libs/cognito";
import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'working-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-northeast-1',
    deploymentBucket: {name: 'working-api-deploy'},
    role: 'arn:aws:iam::146114061358:role/LambdaRole',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  resources: {
    Resources: {
      // Cognito
      UserPool,
      UserPoolDomain,
      UserPoolIdentityProvider,
      UserPoolClient,
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dotenv: {
      path: '.env'
    }
  },
};

module.exports = serverlessConfiguration;
