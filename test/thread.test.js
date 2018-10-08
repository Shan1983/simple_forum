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
  describe("/POST THREAD ROUTES", () => {
    describe("POST /thread/:categoryId", () => {
      it("should NOT proceed if unauthorised");
      it("should check if category exists");
      it("should post a new thread");
    });
    describe("POST /thread/:threadId/lock", () => {
      it("should NOT proceed if unauthorised");
      it('should NOT proceed if role is "Member"');
      it("should check if thread exists");
      it("should lock a thread");
    });
    describe("POST /thread/:threadId/make-sticky", () => {
      it("should NOT proceed if unauthorised");
      it('should NOT proceed if role is "Member"');
      it("should check if thread exists");
      it("should check if thread is locked");
      it("should make a thread sticky");
    });
    describe("POST /thread/:categoryId/move", () => {
      it("should NOT proceed if unauthorised");
      it('should NOT proceed if role is "Member"');
      it("should check if thread exists");
      it("should check if category exists");
      it("should move a thread");
    });
  });
  describe("/PUT THREAD ROUTES", () => {
    describe("PUT /thread/:threadId", () => {
      it("should NOT proceed if unauthorised");
      it("should check if thread exists");
      it("should check if the thread belongs to the user");
      it("should update a thread");
    });
  });
  describe("/DELETE THREAD ROUTES", () => {
    describe("DELETE /thread/:threadId", () => {
      it("should NOT proceed if unaithorised");
      it('should NOT proceed if role is not "Admin"');
      it("should check if thread exists");
      it("should delete a thread");
    });
  });
});
