"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("PENALTY BOX", () => {
  describe("/POST PENALTY BOX ROUTES", () => {
    describe("POST /api/v1/penaltybox/:userId", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const pb = await agent
          .post(`/api/v1/penaltybox/1`)
          .set("content-type", "application/json");

        pb.should.have.status(401);
      });
      it("should not proceed if user role is member", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .post(`/api/v1/penaltybox/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(401);
      });
      it("should add a user to the penalty box - HIGH", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .post(`/api/v1/penaltybox/5`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            duration: "5",
            reason: "some reason",
            severity: "HIGH"
          });

        pb.should.have.status(200);
      });
      it("should add a user to the penalty box - LOW", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .post(`/api/v1/penaltybox/4`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            duration: "3",
            reason: "some reason",
            severity: "LOW"
          });

        pb.should.have.status(200);
      });
    });
  });
  describe("/GET PENALTY BOX ROUTES", () => {
    describe("GET /api/v1/penaltybox/", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const pb = await agent
          .get(`/api/v1/penaltybox`)
          .set("content-type", "application/json");

        pb.should.have.status(401);
      });
      it("should not proceed if user role is member", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .get(`/api/v1/penaltybox`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(401);
      });
      it("should return a list of users in the penalty box", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .get(`/api/v1/penaltybox`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(200);
      });
    });
  });
  describe("/DELETE PENALTY BOX ROUTES", () => {
    describe("DELETE /api/v1/penaltybox/:userId", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const pb = await agent
          .delete(`/api/v1/penaltybox/1`)
          .set("content-type", "application/json");

        pb.should.have.status(401);
      });
      it("should not proceed if user role is not admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .delete(`/api/v1/penaltybox/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(401);
      });
      it("should not proceed if user does not exist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .delete(`/api/v1/penaltybox/99`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(400);
      });
      it("should remove a user from the penalty box", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const pb = await agent
          .delete(`/api/v1/penaltybox/4`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        pb.should.have.status(200);
      });
    });
  });
});

/**
 * Penalty box side effect(s) test
 */
describe("PENALTY BOX SIDE EFFECTS", () => {
  describe("PENALTY - CAN CREATE THREAD", () => {
    it("should prevent a user creating a thread", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "banned@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const thread = await agent
        .post(`/api/v1/thread/2`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          title: "test thread from fred",
          category: 2,
          discussion: "big long rant about nothing in particular"
        });

      thread.should.have.status(400);
    });
  });
  describe("PENALTY - CAN CREATE POST", () => {
    it("should prevent user in penalty box from creating new posts", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "banned@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const post = await agent
        .post(`/api/v1/post/6`)
        .set("content-type", "application/json")
        .set("Authorization", token)

        .send({
          discussion: "A really long rant about something...",
          UserId: 2,
          ThreadId: 6
        });

      post.should.have.status(400);
    });
  });
});
