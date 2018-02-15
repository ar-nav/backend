import AWS from "aws-sdk";
import handler from "../src/handler";

describe("get event", () => {
  it("Should get Event data", () => {
    const event = {
      field: "getEvents"
    };
    const context = {};
    handler.graphqlHandler(event, context, (err, data) => {
      expect(err).toBeNull()
    });
  });
  it("Should get Event data", () => {
    const event = {
      
    };
    const context = {};
    handler.graphqlHandler(event, context, (err, data) => {
      expect(data).toBeNull()
    });
  });

  it("Should Create Event data", () => {
    const event = {
      field: "createEvent",
      arguments: {
        input: {
          eventName: "Test"
        }
      }
    };
    const context = {};
    handler.graphqlHandler(event, context, (err, data) => {
    });
  });
  it("Should error Create Event data", () => {
    const event = {
      field: "createEvent",
      arguments: {
        input : {
          eventName: null
        }
      }
    };
    const context = {};
    handler.graphqlHandler(event, context, (err, data) => {
      // console.log("ini data post", err);
    });
  });
  // it("Should get place data", () => {
  //   const event = {
  //     field: "getPlace",
  //     arguments: {
  //       ID: "asaks"
  //     }
  //   }
  //   const context = {};
  //   handler.graphqlHandler(event, context, function(err, data) {
  //     console.log('ini get place',data);
  //   });
  // });
});
