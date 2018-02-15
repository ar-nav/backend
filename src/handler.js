import "babel-polyfill";

import shakeId from "uuid/v1";
import AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};
// let dynamoDb = null

// if (process.env.NODE_ENV == "test") {
  AWS.config.update({
    // accessKeyId: "localAccessKey",
    // secretAccessKey: "localSecretAccessKey",
    region: "us-east-1"
  });
//   dynamoDb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });
// }
// else {
//   dynamoDb = new AWS.DynamoDB.DocumentClient();
// }

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import {getRawEvent, postEvent, deleteRawEvent} from './events'
import {getRawPlace, postPlace, updateRawPlace, deleteRawPlace, getAllPlaceRawByEvenId, getAllRawPlaceByEventId} from './places'

exports.graphqlHandler = (event, context, callback) => {

  switch (event.field) {
    case "getEvents": {
      getRawEvent(event.field)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });

      break;
    }
    case "createEvent": {
      postEvent(event.arguments.input.eventName)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });

      break;
    }
    case "deleteEvent": {
      deleteRawEvent(event.arguments)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });

      break;
    }
    case "getPlace": {
      getRawPlace(event.arguments)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });
      break;
    }
    case "createPlace": {
      postPlace(event.arguments.input)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });
      break;
    }
    case "updatePlace": {
      updateRawPlace(event.arguments.input)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });
      break;
    }
    case "deletePlace": {
      deleteRawPlace(event.arguments)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });
      break;
    }
    case "getAllPlaces": {
      getAllPlaceRawByEvenId(event.arguments.input)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err)
        });
      break;
    }
    case "searchAllPlaceByEventId": {
      getAllRawPlaceByEventId(event.arguments.eventId)
        .then(result => {
          callback(null, result);
        })
        .catch(err => {
          callback(err)
        });
      break;
    }
    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
