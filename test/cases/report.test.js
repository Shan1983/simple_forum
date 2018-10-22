"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("REPORT ROUTES", () => {
  describe("/POST REPORT ROUTES", () => {
    describe("POST /api/v1/report/:threadId", () => {
      it("should not proceed unless authenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const report = await agent
          .post(`/api/v1/report/6`)
          .set("content-type", "application/json");

        report.should.have.status(401);
      });
      it("should create a new thread report", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .post(`/api/v1/report/6`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reason: "Spam", complaint: "tsk!" });

        report.should.have.status(200);
      });
    });
    describe("POST /api/v1/report/:threadId/:postId", () => {
      it("should not proceed unless authenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const report = await agent
          .post(`/api/v1/report/6/1`)
          .set("content-type", "application/json");

        report.should.have.status(401);
      });
      it("should create a new post report", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .post(`/api/v1/report/6/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reason: "Spam", complaint: "tsk!2" });

        report.should.have.status(200);
      });
    });
  });
  describe("/GET REPORT ROUTES", () => {
    describe("GET /api/v1/report/", () => {
      it("should not proceed unless authenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const report = await agent
          .get(`/api/v1/report`)
          .set("content-type", "application/json");

        report.should.have.status(401);
      });
      it("should not proceed unless user is a leader", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .get(`/api/v1/report`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        report.should.have.status(401);
      });
      it("should return a list of reports", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .get(`/api/v1/report`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        report.should.have.status(200);
      });
    });
  });
  describe("/DELETE REPORT ROUTES", () => {
    describe("DELETE /api/v1/report/:reportId", () => {
      it("should not proceed unless authenticated", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        // const token = `Bearer ${user.body.token}`;

        const report = await agent
          .delete(`/api/v1/report/1`)
          .set("content-type", "application/json");

        report.should.have.status(401);
      });
      it("should not proceed unless user is a leader", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .delete(`/api/v1/report/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        report.should.have.status(401);
      });
      it("should remove a report", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const report = await agent
          .delete(`/api/v1/report/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        report.should.have.status(200);
      });
    });
  });
});
