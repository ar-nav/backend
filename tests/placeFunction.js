import AWS from "aws-sdk";

const places = require("../src/places");

describe("get event", () => {
  it("should get Place Data", () => {
    // AWS.config.apiVersions = {
    //   dynamodb: '2012-08-10'
    // };
    places.getRawPlace().then(result => {
      console.log(result)
    })
    .catch(err => console.log(err))
  });
  it("should create Place Data", () => {
    // AWS.config.apiVersions = {
    //   dynamodb: '2012-08-10'
    // };
    places.postPlace().then(result => {
      console.log(result)
    })
    .catch(err => console.log(err))
  });
  it("should update Place Data", () => {
    // AWS.config.apiVersions = {
    //   dynamodb: '2012-08-10'
    // };
    places.updateRawPlace().then(result => {
      console.log(result)
    })
    .catch(err => console.log(err))
  });
  it("should delete Place Data", () => {
    // AWS.config.apiVersions = {
    //   dynamodb: '2012-08-10'
    // };
    places.deleteRawPlace().then(result => {
      console.log(result)
    })
    .catch(err => console.log(err))
  });
});
