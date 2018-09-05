import * as chai from "chai";
import { toLambda } from "../../dist/lambda";
import { dummyBot } from "./dummy-bot";

chai.should();

describe("toLambda function test", function() {
  describe("#toLambda()", function() {
    it("should return an Express Application", function() {
      toLambda(dummyBot).should.have.property("use");
    });
  });
});
