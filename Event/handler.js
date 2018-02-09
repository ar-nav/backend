const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    } 
  });
});


const	getTableName = function () {
		return process.env.DYNAMODB_TABLE;
  }
  
const	addPlace = function (place) {
		const params = {
			TableName: getTableName(),
			Item: {
				placeId: place.placeId,
				placeName: place.placeName,
        langlitude: place.langlitude,
        longlitude: place.longlitude,          
        eventId: place.eventId,
        eventName: place.eventName
			}
		};
		return dynamoDb.put(params).promise().then(() => place);
  }
  
const	getPlace = function (placeId) {
		const params = {
			TableName: getTableName(),
			AttributesToGet: ['placeId', 'placeName', 'langlitude', 'longlitude', 'eventId', 'eventName']
		};
		if (placeId) {
			//search by placeId
			params.Key = {placeId: placeId};
			return dynamoDb.get(params).promise()
				.then(data => [data.Item]);
		} else {
			//get all users
			return dynamoDb.scan(params).promise()
				.then(data => data.Items);
		}
  }
  
const	deletePlace = function (placeId) {
		let toBeDeletedPlace;

		return getPlace(placeId)
			.then(resultArr => {
				toBeDeletedPlace = resultArr[0];
				if (!toBeDeletedPlace || !toBeDeletedPlace.placeId) {
					throw `Delete user failed: no user with placeId ${placeId}`;
				}
			}).then(() => {
				const params = {
					TableName: getTableName(),
					Key: {
						placeId: placeId
					}
				};
				return dynamoDb.delete(params).promise();
			}).then(() => toBeDeletedUser);
	}; //deleteUser

const placeType = new GraphQLObjectType({
        name: 'Places',
        fields: {
          placeId: { name: 'placeId', type: new GraphQLNonNull(GraphQLString) },
          placeName: { name: 'placeName', type: new GraphQLNonNull(GraphQLString) },
          langlitude: { name: 'langlitude', type: new GraphQLNonNull(GraphQLInt) },
          longlitude: { name: 'longlitude', type: new GraphQLNonNull(GraphQLInt) },          
          eventId: { name: 'eventId', type: new GraphQLNonNull(GraphQLString) },
          eventName: { name: 'eventName', type: new GraphQLNonNull(GraphQLString) }
        }
      })

const queryType = new GraphQLObjectType({
        name: 'query', // an arbitrary name
        description: 'query Place',
        fields: {
          // the query has a field called 'greeting'
          place: {
            // we need to know the user's name to greet them
            type: new GraphQLList(placeType),
            args: { 
              placeId: { name: 'placeId', type: new GraphQLNonNull(GraphQLString) },
              
            },
            // resolve to a greeting message
            resolve: (parent, args) => getPlace(args.placeId),
          },
        },
      })
const mutationType = new GraphQLObjectType({
        name: 'Mutation', // an arbitrary name
        description: 'Mutation of the users',
        fields: {
          addPlace: {
            type: placeType,
            args: {
              placeId: { name: 'placeId', type: new GraphQLNonNull(GraphQLString) },
              placeName: { name: 'placeName', type: new GraphQLNonNull(GraphQLString) },
              langlitude: { name: 'langlitude', type: new GraphQLNonNull(GraphQLInt) },
              longlitude: { name: 'longlitude', type: new GraphQLNonNull(GraphQLInt) },          
              eventId: { name: 'eventId', type: new GraphQLNonNull(GraphQLString) },
              eventName: { name: 'eventName', type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (source, args) => addPlace(args)
          },
          changeNickname: {
            type: placeType,
            args: {
              placeId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (source, args) => deleteUser(args.placeId)
          
          },
        },
      })

const grapSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

// We want to make a GET request with ?query=<graphql query>
// The event properties are specific to AWS. Other providers will differ.
module.exports.graphql = (event, context, callback) => {
  graphql(grapSchema, event.queryStringParameters.query)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) })
  )
  .catch(err => callback(null, { statusCode: 500, body: err}))
}