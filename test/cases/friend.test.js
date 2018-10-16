"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const { Friend, FriendPending, User } = require("../../models");

describe("FRIEND", () => {
  describe("/POST FRIEND ROUTES", () => {
    describe("POST /api/v1/friend/:userId/new", () => {
      it("should not proceed if unauthenticated");
      it("should fail if request does not exist");
      it("should send a friend request");
    });
    describe("POST /api/v1/friend/:userId/accept", () => {
      it("should not proceed if a not authenticated");
      it("should fail if not user exists");
      it("should fail if the friend request doesn't exist");
      it("should accept a friends request");
    });
    describe("POST /api/v1/friend/:userId/decline", () => {
      it("should not proceed if unauthenticated");
      it("should fail if user does not exist");
      it("should fail if pending request does not exist");
      it("should decline a users friend request");
    });
  });
  describe("/GET FRIEND ROUTES", () => {
    describe("GET /api/v1/friend/:userId/all", () => {
      it("should NOT proceed if unauthenticated");
      it("should NOT return a different users friends");
      it("should return all the users friends");
    });
  });
  describe("DELETE FRIEND ROUTES", () => {
    describe("DELETE /api/v1/friend/:fromId/:toId/remove", () => {
      it("should not proceed if unauthenticated");
      it("should fail if pending request does not exist");
      it("should remove a friend");
    });
  });
});
