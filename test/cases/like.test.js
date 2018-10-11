"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("LIKE", () => {
  describe("/POST LIKE ROUTES", () => {
    describe("POST /api/v1/like/:threadId/thread", () => {
      it("should NOT like a thread if token is incorrect", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}1278`;

        const post = await agent
          .post(`/api/v1/like/6/thread`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(401);
      });
      it("should like a thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/6/thread`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(200);
      });
    });
  });
});
