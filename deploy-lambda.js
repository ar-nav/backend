// Load the SDK for JavaScript
const AWS = require('aws-sdk');
const fs = require('fs');

// Set the region
AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(require('bluebird'));

const appsync = new AWS.AppSync({ apiVersion: '2017-07-25' });

// For creating User Pool: Reference https://serverless-stack.com/chapters/create-a-cognito-user-pool.html
// API key is not recommended for security.

const graphQLAPIName = 'arahan service'; // your graphQL API Name
const awsRegion = 'us-east-1'; // AWS Region ex - us-east-1
const userPoolId = 'us-east-1_tGZgUAA9n'; // Your Cognito User Pool Id
const roleName = 'ArahanProject';
const accountId = '015852978777';
const serviceRole = `arn:aws:iam::${accountId}:role/${roleName}`; // Service IAM Role for appsync to access data sources
const functionName = 'serverless-Arahan-production-graphql';
const lambdaArn = `arn:aws:lambda:${awsRegion}:${accountId}:function:${
  functionName
}`;

const MAX_RETRIES = 100;
let appId;

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

const createGraphQLAPIParams = {
  authenticationType: 'AMAZON_COGNITO_USER_POOLS' /* required */,
  name: graphQLAPIName /* required */,
  userPoolConfig: {
    awsRegion: awsRegion /* required */,
    defaultAction: 'ALLOW' /* required */,
    userPoolId: userPoolId /* required */,
  },
};

/* STEP 1 : Create GRAPHQL EndPoint */
appsync
  .createGraphqlApi(createGraphQLAPIParams)
  .promise()
  .then(async data => {
    console.log(data); // successful response
    console.log(`GraphQL API ID : ${data.graphqlApi.apiId}`);
    console.log(`GraphQL EndPoint : ${data.graphqlApi.uris.GRAPHQL}`);

    appId = data.graphqlApi.apiId;

    const datasourceParams = [
      {
        apiId: appId /* required */,
        name: 'lambda' /* required */,
        type: 'AWS_LAMBDA' /* required */,
        description: 'arahan function',
        lambdaConfig: {
          lambdaFunctionArn: lambdaArn /* required */,
        },
        serviceRoleArn: serviceRole,
      },
    ];

    const dataSourceList = [];

    for (let i = 0; i < datasourceParams.length; i++) {
      dataSourceList.push(
        appsync.createDataSource(datasourceParams[i]).promise()
      );
    }

    /* STEP 2 : Attach DataSources to GRAPHQL EndPoint */
    await Promise.all(dataSourceList).then(result => {
      console.log('all the datasources are created');
      console.log(result);
    });
  })
  .then(() => {
    const file = fs.readFileSync('schema.graphql', 'utf8');

    const schemaCreationparams = {
      apiId: appId /* required */,
      definition: new Buffer(file),
    };

    /* STEP 3 : Create GraphQL Schema */
    return appsync.startSchemaCreation(schemaCreationparams).promise();
  })
  .then(async data => {
    console.log(data);

    const schemaCreationparams = {
      apiId: appId /* required */,
    };

    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        let success = false;

        await appsync
          .getSchemaCreationStatus(schemaCreationparams)
          .promise()
          .then(result => {
            console.log(result);
            if (result.status === 'SUCCESS') {
              success = true;
            }
          });

        if (success) break;
      } catch (err) {
        const timeout = 10;
        console.log('Waiting', timeout, 'ms');
        await wait(timeout);
        console.log('Retrying', err.message, i);
      }
    }
  })
  .then(() => {
    const getSchemaParams = {
      apiId: appId /* required */,
      format: 'SDL' /* required */,
    };

    /* STEP 4 : GET Schema for GraphQL Endpoint */
    return appsync.getIntrospectionSchema(getSchemaParams).promise();
  })
  .then(data => {
    console.log(data); // successful response

    const schema = new Buffer(data.schema, 'base64');
    console.log(schema.toString());
  })
  .then(async () => {
    const resolverParams = [
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'getEvents' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/getEvent-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Query' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/getEvent-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'createEvent' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/createEvent-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Mutation' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/createEvent-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'getPlace' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/getPlace-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Query' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/getPlace-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'createPlace' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/createPlace-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Mutation' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/createPlace-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'updatePlace' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/updatePlace-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Mutation' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/updatePlace-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'deletePlace' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/deletePlace-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Mutation' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/deletePlace-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'getAllPlaces' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/getAllPlaceByEventId-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Query' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/getAllPlaceByEventId-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      },
      {
        apiId: appId /* required */,
        dataSourceName: 'lambda' /* required */,
        fieldName: 'searchAllPlaceByEventId' /* required */,
        requestMappingTemplate: fs.readFileSync(
          'mapping-templates/searchAllPlaceByEventId-request-mapping-template.txt',
          'utf8'
        ) /* required */,
        typeName: 'Query' /* required */,
        responseMappingTemplate: fs.readFileSync(
          'mapping-templates/searchAllPlaceByEventId-response-mapping-template.txt',
          'utf8'
        ) /* required */,
      }
    ];

    const resolverList = [];

    for (let i = 0; i < resolverParams.length; i++) {
      resolverList.push(appsync.createResolver(resolverParams[i]).promise());
    }

    /* STEP 5 : Create Resolvers */
    await Promise.all(resolverList).then(data => {
      console.log('all the resolvers are created');
      console.log(data);
    });
  })
  .then(() => {
    const listParams = {
      apiId: appId /* required */,
      format: 'SDL' /* required */,
    };

    return appsync.listTypes(listParams).promise();
  })
  .then(data => console.log(data))
  .catch(err => console.log(err));
