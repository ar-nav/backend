import "babel-polyfill";

import shakeId from "uuid/v1";
import AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};
// let dynamoDb = null

// if (process.env.NODE_ENV == "test") {
//   AWS.config.update({
//     accessKeyId: "localAccessKey",
//     secretAccessKey: "localSecretAccessKey",
//     region: "localRegion"
//   });
//   dynamoDb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });
// }
// else {
//   dynamoDb = new AWS.DynamoDB.DocumentClient();
// }

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import {getRawEvent, postEvent, deleteRawEvent} from './events'
import {getRawPlace, postPlace, updateRawPlace, deleteRawPlace, getAllPlaceRawByEvenId, getAllRawPlaceByEventId} from './places'

exports.graphqlHandler = (event, context, callback) => {
  console.log("Received event {}", JSON.stringify(event));

  console.log("Got an Invoke Request.");
  switch (event.field) {
    case "getEvents": {
      getRawEvent(event.field)
        .then(result => {
          // console.log('dataresult get Event',  JSON.stringify(result, null, 2));
          callback(null, result);
        })
        .catch(err => {
          // console.log('ini err get event', err)
          callback(err);
        });

      break;
    }
    case "createEvent": {
      postEvent(event.arguments.input.eventName)
        .then(result => {
          // console.log('data result create Event', result)
          callback(null, result);
        })
        .catch(err => {
          // console.log('fast', err)
          callback(err);
        });

      break;
    }
    case "deleteEvent": {
      deleteRawEvent(event.arguments)
        .then(result => {
          // console.log('data result create Event', result)
          callback(null, result);
        })
        .catch(err => {
          // console.log('fast', err)
          callback(err);
        });

      break;
    }
    case "getPlace": {
      console.log("eventArguments", event.arguments);
      getRawPlace(event.arguments)
        .then(result => {
          console.log('data result create Place', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast get Place', err)
          callback(err);
        });
      break;
    }
    case "createPlace": {
      console.log("event post place", event.arguments.input);
      postPlace(event.arguments.input)
        .then(result => {
          console.log('data result create Place', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast place', err)
          callback(err);
        });
      break;
    }
    case "updatePlace": {
      console.log("event post place", event.arguments.input);
      updateRawPlace(event.arguments.input)
        .then(result => {
          console.log('data result create Place', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast place', err)
          callback(err);
        });
      break;
    }
    case "deletePlace": {
      console.log("event post place", event.arguments.input);
      deleteRawPlace(event.arguments.input)
        .then(result => {
          console.log('data result create Place', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast place', err)
          callback(err);
        });
      break;
    }
    case "getAllPlaces": {
      console.log("get All Place By Event ID", event.arguments.input);
      getAllPlaceRawByEvenId(event.arguments.input)
        .then(result => {
          console.log('data result create Place', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast place', err)
          callback(err)
        });
      break;
    }
    case "searchAllPlaceByEventId": {
      console.log("search All Place By Event ID", event.arguments);
      getAllRawPlaceByEventId(event.arguments.eventId)
        .then(result => {
          console.log('data result Search ALL By Event ID', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast place', err)
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
