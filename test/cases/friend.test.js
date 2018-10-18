"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("FRIEND", () => {
  describe("/POST FRIEND ROUTES", () => {
    describe("POST /api/v1/friend/:userId/new", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/new`)
          .set("content-type", "application/json");

        friend.should.have.status(401);
      });
      it("should send a friend request", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/5/new`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(200);
      });
    });
    describe("POST /api/v1/friend/:userId/accept", () => {
      it("should not proceed if a not authenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/accept`)
          .set("content-type", "application/json");

        friend.should.have.status(401);
      });
      it("should fail if not user exists", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/accept`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should send a friend request", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/accept`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should fail if the friend request doesn't exist", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/1/accept`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should accept a friends request", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/5/accept`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(200);
      });
    });
    describe("POST /api/v1/friend/:userId/decline", () => {
      before(async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/1/new`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(200);
      });
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/decline`)
          .set("content-type", "application/json");

        friend.should.have.status(401);
      });
      it("should fail if user does not exist", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/99/decline`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should fail if pending request does not exist", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/4/decline`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should decline a users friend request", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .post(`/api/v1/friend/1/decline`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(200);
      });
    });
  });
  describe("/GET FRIEND ROUTES", () => {
    describe("GET /api/v1/friend/:userId/all", () => {
      it("should NOT proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const friend = await agent
          .get(`/api/v1/friend/1/all`)
          .set("content-type", "application/json");

        console.log(friend.body);

        friend.should.have.status(401);
      });
      it("should NOT return a nonregistered user", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .get(`/api/v1/friend/99/all`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(400);
      });
      it("should return all the users friends", async () => {
        const agent = chai.request.agent(server);

        const fred = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        fred.should.have.status(200);

        const token = `Bearer ${fred.body.token}`;

        const friend = await agent
          .get(`/api/v1/friend/4/all`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        friend.should.have.status(200);
      });
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
