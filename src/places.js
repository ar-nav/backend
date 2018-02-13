export async function getRawPlace(handle) {
  return new Promise((resolve, reject) => {
    let params = {
      Key: {
        ID: handle.ID
      },
      TableName: "Places"
    };
    dynamoDb.get(params, function(err, data) {
      if (!err) {
        console.log("yolo", JSON.stringify(err));
        resolve(data);
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
        placeName: handle.placeName,
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
          name: handle.placeName,
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
            ":placeName": handle.input.placeName || data.placeName,
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
