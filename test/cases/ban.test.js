"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const { Ban, User } = require("../../models");

describe("BAN", () => {
  before(async () => {
    const agent = chai.request.agent(server);

    const register = await chai
      .request(server)
      .post("/api/v1/user/register")
      .set("content-type", "application/json")
      .send({
        username: "mrBanned",
        email: "banned@test.com",
        password: "secret"
      });

    register.should.have.status(200);

    const userToken = await User.findById(5);

    const tokenRes = await chai
      .request(server)
      .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

    tokenRes.should.have.status(200);
  });
  describe("/POST BAN ROUTES", () => {
    describe("POST /api/v1/ban", () => {
      it("should NOT proceed if NOT authorized", async () => {
        const agent = chai.request.agent(server);

        const ban = await agent
          .post(`/api/v1/ban`)
          .set("content-type", "application/json");

        ban.should.have.status(401);
      });
      it("should NOT proceed if user is NOT an ADMIN", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/ban`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(401);
      });
      it("should ban a user", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/ban`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ userId: 5, reason: "being naughty" });

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
  });
  describe("/DELETE BAN ROUTES", () => {
    describe("DELETE /api/v1/ban/", () => {
      it("should NOT proceed if NOT authorized", async () => {
        const agent = chai.request.agent(server);

        const ban = await agent
          .delete(`/api/v1/ban`)
          .set("content-type", "application/json");

        ban.should.have.status(401);
      });
      it("should NOT proceed if user is NOT ADMIN", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .delete(`/api/v1/ban`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(401);
      });
      it("should remove a user from the ban list", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .delete(`/api/v1/ban`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ email: "banned@test.com" });

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
  });
});
