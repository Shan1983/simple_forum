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
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should NOT proceed if thread is locked", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "shan@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const locked = await agent
          .post(`/api/v1/thread/2/lock`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reason: "SPAM", message: "Testing" });

        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json")
          .set("Authorization", token);
        // .send({
        //   title: "birds",
        //   description: "birds from test suit"
        // });

        locked.should.have.status(200);

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.lockedError
        );
      });

      it("should return a thread", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "shan@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const thread = await agent
          .get(`/api/v1/thread/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);
        // .send({
        //   title: "birds",
        //   description: "birds from test suit"
        // });

        thread.should.have.status(200);
        thread.body.should.have.property("title");
        thread.body.should.have.property("Posts");
        thread.body.should.have.property("discussion");
        thread.body.should.have.property("Category", "Other");
      });
    });
    describe("GET /thread/:categoryId/deleted/thread", () => {
      it("should NOT proceed if unauthorised");
      it('should NOT proceed if users role is "Member"');
      it("should return deleted threads");
    });
  });
  describe("/POST THREAD ROUTES", () => {
    describe("POST /thread/:categoryId", () => {
      it("should NOT proceed if unauthorised");
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
