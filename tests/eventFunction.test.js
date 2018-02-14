import AWS from "aws-sdk";

const event = require("../src/events");

describe("get event", () => {
  it("should get Event Data", () => {
    event.getRawEvent().then(result => {
      expect(result).not.toBeNull()
    })
    .catch(err => console.log(err))
  });
});

describe("post event", () => {
  it("should get Event Data", () => {
    event.postEvent("Test").then(result => {
      expect(result).not.toBeNull()
    })
    .catch(err => console.log(err))
  });
})
