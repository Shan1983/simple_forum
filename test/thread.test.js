"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("THREAD", () => {
  describe("/GET THREAD ROUTES", () => {
    describe("GET /thread/:threadId", () => {
      it("should NOT proceed if unauthorised");
      it("should NOT proceed if no category found");
      it("should NOT proceed if thread is locked");
      it("should check sticky duration");
      it("should return a thread");
    });
    describe("GET /thread/:categoryId/deleted/thread", () => {
      it("should NOT proceed if unauthorised");
      it('should NOT proceed if users role is "Member"');
      it("should NOT proceed category is not found");
      it("should return deleted threads");
    });
  });
  describe("/POST THREAD ROUTES", () => {});
  describe("/PUT THREAD ROUTES", () => {});
  describe("/DELETE THREAD ROUTES", () => {});
});
