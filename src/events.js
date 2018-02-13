import 'babel-polyfill'

import shakeId from "uuid/v1";
import AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

export async function getRawEvent(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Events"
    };
    dynamoDb.scan(params, function(err, data) {
      console.log('masuk')
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

export async function postEvent(handle) {
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
