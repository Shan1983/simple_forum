"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("REWARD ROUTES", () => {
  describe("/GET REWARD ROUTE", () => {
    it("not proceed if not unauthenticated", async () => {
      const agent = chai.request.agent(server);

      const reward = await agent
        .get(`/api/v1/reward`)
        .set("content-type", "application/json");

      reward.should.have.status(401);
    });
    it("not proceed if not a leader", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "fred@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const reward = await agent
        .get(`/api/v1/reward`)
        .set("content-type", "application/json")
        .set("Authorization", token);

      reward.should.have.status(401);
    });
    it("should return all rewards points", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "turtle@test.com",
        password: "test123"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const reward = await agent
        .get(`/api/v1/reward`)
        .set("content-type", "application/json")
        .set("Authorization", token);

      reward.should.have.status(200);
    });
  });
  describe("/POST REWARD ROUTE", () => {
    it("not proceed if not unauthenticated", async () => {
      const agent = chai.request.agent(server);

      const reward = await agent
        .post(`/api/v1/ban`)
        .set("content-type", "application/json");

      reward.should.have.status(401);
    });
    it("not proceed if not a leader", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "fred@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const reward = await agent
        .post(`/api/v1/reward`)
        .set("content-type", "application/json")
        .set("Authorization", token);

      reward.should.have.status(401);
    });
    it("should update rewards", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "turtle@test.com",
        password: "test123"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const reward = await agent
        .post(`/api/v1/reward`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          pointsPerPost: 20,
          pointsPerThread: 20,
          pointsPerLike: 20,
          pointsPerBestPost: 50,
          pointsForAdvertising: 1000,
          pointsPerPollQuestion: 20,
          pointsPerPollVote: 20
        });

      reward.should.have.status(200);
    });
  });
});
