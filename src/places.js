import "babel-polyfill";
import shakeId from "uuid/v1";

import AWS from "aws-sdk";

AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};
// let dynamoDb = null

// if (process.env.NODE_ENV == "test") {
//   console.log('masuk if')
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

export async function getRawPlace(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Places",
      Key: {
        ID: handle.ID
      }
    };
    console.log('handle Places', handle.ID)
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        console.log("yolo", JSON.stringify(data));
        dynamoDb.scan(
          {
            Key: {
              ID: {S : data.Item.eventId}
            },
            TableName: "Events"
          },
          function(err, result) {
            data.Item.event = result.Item
            resolve(data.Item)
          }
        );
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
export async function postPlace(handle) {
  console.log("handle create place", handle);
  return new Promise((resolve, reject) => {
    let id = shakeId();
    let params = {
      TableName: "Places",
      Item: {
        ID: id,
        name: handle.name,
        latitude: handle.latitude,
        longitude: handle.longitude,
        eventId: handle.eventId
      }
    };
    dynamoDb.put(params, function(err, data) {
      if (!err) {
        console.log("yolo", JSON.stringify(err));
        resolve({
          ID: id,
          name: handle.name,
          latitude: handle.latitude,
          longitude: handle.longitude,
          eventId: handle.eventId
        });
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
export async function updateRawPlace(handle) {
  console.log("handle create place", handle);
  return new Promise((resolve, reject) => {
    let id = shakeId();
    let params = {
      TableName: "Places",
      Key: {
        ID: handle.ID
      }
    };
    dynamoDb.get(params, function(err, data) {
      if (!err) {
        let paramUpdate = {
          TableName: "Music",
          Key: {
            ID: handle.ID
          },
          UpdateExpression:
            "SET placeName = :placeName, langlitude = :langlitude, longlitude = :longlitude, eventId = :eventId",
          ExpressionAttributeValues: {
            ":placeName": handle.input.name || data.name,
            ":langlitude": handle.input.langlitude || data.langlitude,
            ":longitude": handle.input.longitude || data.longitude,
            ":eventId": handle.input.eventId || data.eventId
          },
          ReturnValues: "UPDATED_NEW"
        };
        dynamoDb.put(paramUpdate, function(err, result) {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
export async function deleteRawPlace(handle) {
  console.log("handle create place", handle);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "Places",
      Key: {
        ID: handles.ID
      }
    };
    dynamoDb.delete(params, function(err, data) {
      if (!err) {
        console.log("yolo", JSON.stringify(err));
        resolve({
          ID: handle.ID
        });
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
export async function getAllPlaceRawByEvenId(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Places"
    };
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        let counter = 0
        data.Items.forEach((item) => {
          dynamoDb.get({ Key: { ID: item.eventId }, TableName: "Events"}, function(err, dataEvent) {
            counter++
            if(!err){
               item.event = dataEvent.Item
            }
            if (counter === data.Items.length){
              resolve(data.Items);
            }
          })

        })
        console.log("yolo", JSON.stringify(data.Items));

      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
export async function getAllRawPlaceByEventId(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "Places"
    };
    dynamoDb.scan(params, function(err, data) {
      if (!err) {
        let counter = 0
        let dataFilter = data.Items.filter(item => {
          return item.eventId === handle
        })
        dataFilter.forEach((item) => {
          dynamoDb.get({ Key: { ID: item.eventId }, TableName: "Events"}, function(err, dataEvent) {
            counter++
            if(!err){
               item.event = dataEvent.Item
            }
            if (counter === data.Items.length){
              resolve(dataFilter);
            }
          })

        })
        console.log("yolo", JSON.stringify(dataFilter));

      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}
