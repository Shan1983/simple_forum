"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("BLACKLIST", () => {
  describe("/GET BLACKLIST ROUTES", () => {
    describe("GET /api/v1/blacklist/", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const blacklist = await agent
          .get(`/api/v1/blacklist/`)
          .set("content-type", "application/json");

        blacklist.should.have.status(401);
      });
      it("should not proceed if user is not a leader", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .get(`/api/v1/blacklist/`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        blacklist.should.have.status(401);
      });
      it("should return the blacklist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .get(`/api/v1/blacklist/`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        blacklist.should.have.status(200);
      });
    });
  });
  describe("/POST BLACKLIST ROUTES", () => {
    describe("POST /api/v1/blacklist/", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const blacklist = await agent
          .post(`/api/v1/blacklist/`)
          .set("content-type", "application/json");

        blacklist.should.have.status(401);
      });
      it("should not proceed if user is not a leader", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .post(`/api/v1/blacklist/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            playerTag: "#12345",
            currentName: "Fred",
            reason: "some reason"
          });

        blacklist.should.have.status(401);
      });
      it("should add new user to blacklist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .post(`/api/v1/blacklist/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            playerTag: "#12345",
            currentName: "Fred",
            reason: "some reason"
          });

        blacklist.should.have.status(200);
      });
    });
  });
  describe("/DELETE BLACKLIST ROUTES", () => {
    describe("DELETE /api/v1/blacklist/:id", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const blacklist = await agent
          .delete(`/api/v1/blacklist/1`)
          .set("content-type", "application/json");

        blacklist.should.have.status(401);
      });
      it("should not proceed if not admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .delete(`/api/v1/blacklist/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            playerTag: "#12345",
            currentName: "Fred",
            reason: "some reason"
          });

        blacklist.should.have.status(401);
      });
      it("should delete a user from the blacklist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const blacklist = await agent
          .delete(`/api/v1/blacklist/2`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ playerTag: "#12345" });

        blacklist.should.have.status(200);
      });
    });
  });
});
