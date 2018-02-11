import 'babel-polyfill';

import shakeId from 'uuid/v1'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log('Importing data into DynamoDB. Please wait.');

async function getRawEvent(handle) {
  try {
    let params = {
      Tablename : 'Event',
      event_id: handle
    }
    let getEventInfo = await dynamoDb.get(params, (err, data) => {
      if (err) return err
      else return data
    })
  }
  catch(err) {
    return err
  }
}

async function postEvent(handle) {
  try {
    let params = {
      Tablename: 'Event',
      event_id: uuid(),
      eventName: handle
    }
    let createEvent = await dynamoDb.put(params, (err, data) => { 
      if (err) return err
      else return data
    })
  }
  catch(err) {

  }
}

exports.graphqlHandler = (event, context, callback) => {
  console.log('Received event {}', JSON.stringify(event, 3));

  console.log('Got an Invoke Request.');
  switch (event.field) {
    case 'getEvent': {
      getRawEvent(event.arguments.ID).then(
        result => {
          callback(null, result);
        }
      );

      break;
    }
    case 'createEvent': {
      postEvent(
        event.arguments.eventName
      ).then(result => {
        callback(null, result);
      });

      break;
    }
    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
