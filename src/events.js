import "babel-polyfill";

import shakeId from "uuid/v1";
const AWS = require("aws-sdk");

AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};
// let dynamoDb = null

// if (process.env.NODE_ENV == "test") {
//   console.log('masuk if')
  AWS.config.update({
    accessKeyId: "AKIAIOYCJRTLVNBWEFFQ",
    secretAccessKey: "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",
    region: "us-east-1"
  });
//   dynamoDb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });
// }
// else {
//   dynamoDb = new AWS.DynamoDB.DocumentClient();
// }
const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

export async function getRawEvent(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Events"
    };
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        resolve(data.Items);
      } else {
        reject(err);
      }
    });
  });
}

export async function postEvent(handle) {
  return new Promise((resolve, reject) => {
    let id = shakeId();
    if (process.env.NODE_ENV != "test") {
      let params = {
        TableName: "Events",
        Item: {
          ID: id,
          name: handle
        }
      };
      dynamoDb.put(params, function(err, data) {
        if (!err) {
          // console.log('yolo', JSON.stringify(err));
          resolve({ ID: id, name: handle });
        } else {
          // console.log(err);
          reject(err);
        }
      });
    } else {
      let params = {
        TableName: "Events",
        Item: {
          ID: {
            S: id
          },
          name: {
            S: handle
          }
        }
      };
      dynamoDb.put(params, function(err, data) {
        if (!err) {
          console.log('yolo', JSON.stringify(err));
          resolve({ ID: id, name: handle });
        } else {
          console.log(err);
          reject(err);
        }
      });
    }
  });
}

export async function deleteRawEvent(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Events",
      Key: {
        ID: handle.ID
      }
    };
    dynamoDb.delete(params, function(err, data) {
      if (!err) {
        // console.log('yolo', JSON.stringify(err));
        resolve({ ID: handle.ID });
      } else {
        // console.log(err);
        reject(err);
      }
    });
  });
}
