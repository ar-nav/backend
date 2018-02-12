import "babel-polyfill";

import shakeId from "uuid/v1";
import AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

async function getRawEvent(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Events"
    };
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        console.log(JSON.stringify(data, null, 2));
        resolve(data.Items);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

async function postEvent(handle) {
  return new Promise((resolve, reject) => {
    let id = shakeId()
    let params = {
      TableName: "Events",
      Item: {
        'ID': id,
        'name': handle
      }
    };
    dynamoDb.put(params, function(err, data) {
      if (!err) {
        console.log('yolo', JSON.stringify(err));
        resolve({ID: id, name: handle});
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

async function getRawPlace(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      ExpressionAttributeNames: {
      "PLC": "ID"
      }, 
      ExpressionAttributeValues: {
      ":a": {
        S: handle.ID
        }
      }, 
      FilterExpression: "Artist = :a", 
      ProjectionExpression: "#PLC", 
      TableName: "Places"
    }
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        console.log('yolo', JSON.stringify(err));
        resolve(data)
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

async function postPlace(handle) {
  console.log("handle create place",handle)
  return new Promise((resolve, reject) => {
    let id = shakeId()
    let params = {
      TableName: "Places",
      Item: {
        'ID': id,
        'placeName': handle.placeName,
        'latitude': handle.latitude,
        'longitude': handle.longitude,
        'eventId': handle.eventId
      }
    }
    dynamoDb.put(params, function(err, data) {
      if (!err) {
        console.log('yolo', JSON.stringify(err));
        resolve({
          ID: id,
          name: handle.placeName,
          latitude: handle.latitude,
          longitude: handle.longitude,
          eventId: handle.eventId
        })
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
async function updateRawPlace(handle) {
  console.log("handle create place",handle)
  return new Promise((resolve, reject) => {
    let id = shakeId()
    let params = {
      TableName: "Places",
      Item: {
        'ID': id,
        'placeName': handle.placeName,
        'latitude': handle.latitude,
        'longitude': handle.longitude,
        'eventId': handle.eventId
      }
    }
    dynamoDb.put(params, function(err, data) {
      if (!err) {
        console.log('yolo', JSON.stringify(err));
        resolve({
          ID: id,
          name: handle.placeName,
          latitude: handle.latitude,
          longitude: handle.longitude,
          eventId: handle.eventId
        })
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
async function deleteRawPlace(handle) {
  console.log("handle create place",handle)
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Places',
      Key:{
          "ID":handles.ID
      }
    }
    dynamoDb.delete(params, function(err, data) {
      if (!err) {
        console.log('yolo', JSON.stringify(err));
        resolve({
          ID: handle.ID
        })
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

exports.graphqlHandler = (event, context, callback) => {
  console.log("Received event {}", JSON.stringify(event));

  console.log("Got an Invoke Request.");
  switch (event.field) {
    case "getEvents": {
      console.log("ini conntex", context);
      getRawEvent(event.field)
        .then(result => {
          console.log('dataresult get Event',  JSON.stringify(result, null, 2));
          callback(null, result);
        })
        .catch(err => {
          console.log('ini err get event', err)
          callback(err);
        });

      break;
    }
    case "createEvent": {
      console.log("eventArguments", context);
      postEvent(event.arguments.input.eventName)
        .then(result => {
          console.log('data result create Event', result)
          callback(null, result);
        })
        .catch(err => {
          console.log('fast', err)
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

    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
