"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("POLL", () => {
  describe("POST POLL ROUTES", () => {
    describe("POST /api/v1/poll/:threadId/new", () => {
      it("should Not proceed if not authenticated");
      it("should Not proceed if a thread doesnot exist");
      it("should Not proceed if a poll has less than 2 responses");
      it("should Not proceed if a poll has duplicate data");
      it("should Not proceed if a poll question is empty");
      it("should create a new poll");
    });
    describe("POST /api/v1/poll/:pollId/:responseId/vote", () => {
      it("should not proceed if unauthenticated");
      it("should not proceed if poll does not exist");
      it("should not proceed if user has already voted");
      it("should vote on a poll");
    });
  });
  describe("GET POLL ROUTES", () => {
    describe("GET /api/v1/poll/:pollId", () => {
      it("should not proceed if unauthenticated");
      it("should not proceed if poll does not exist");
      it("should return a poll");
    });
    describe("GET /api/v1/poll/", () => {
      it("should not proceed if unauthenticated");
      it("should only be accessed by a leader");
      it("should return all polls");
    });
    describe("GET /api/v1/poll/:pollId/results", () => {
      it("should not proceed if not authenticated");
      it("should return a polls current result");
    });
  });
  describe("PUT POLL ROUTES", () => {
    describe("PUT /api/v1/poll/:pollId", () => {
      it("should Not proceed if not authenticated");
      it("should Not proceed if a thread doesnot exist");
      it("should Not proceed if a poll has less than 2 responses");
      it("should Not proceed if a poll has duplicate data");
      it("should Not proceed if a poll question is empty");
      it("should update a poll");
    });
  });
  describe("DELETE POLL ROUTES", () => {
    describe("DELETE /api/v1/poll/:pollId/remove", () => {
      it("should Not proceed if not authenticated");
      it("should only be accessed by a leader");
      it("should delete a poll");
    });
  });
});
