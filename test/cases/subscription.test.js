"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("SUBSCRIPTION ROUTES", () => {
  describe("/POST DESCRIPTION ROUTE", () => {
    describe("POST /api/v1/subscription/:threadId", () => {
      it("should not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const sub = await agent
          .post(`/api/v1/subscription/1`)
          .set("content-type", "application/json");

        sub.should.have.status(401);
      });
      it("should create a new subscription", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const subscription = await agent
          .post(`/api/v1/subscription/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        subscription.should.have.status(200);

        const post = await agent
          .post(`/api/v1/post/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)

          .send({
            discussion: "A really long rant about something...",
            UserId: 1,
            ThreadId: 1
          });

        post.should.have.status(200);
      });
    });
  });
  describe("/DELETE SUBSCRIPTION ROUTE", () => {
    describe("DELETE /api/v1/subscription/:threadId", () => {
      it("should not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const sub = await agent
          .delete(`/api/v1/subscription/1`)
          .set("content-type", "application/json");

        sub.should.have.status(401);
      });
      it("should delete a subscription", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const subscription = await agent
          .delete(`/api/v1/subscription/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        subscription.should.have.status(200);
      });
    });
  });
});
