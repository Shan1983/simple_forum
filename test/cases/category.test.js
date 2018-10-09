"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const { User } = require("../../models");

describe("Category", () => {
  before(async () => {
    const agent = chai.request.agent(server);

    const register = await chai
      .request(server)
      .post("/api/v1/user/register")
      .set("content-type", "application/json")
      .send({ username: "Fred", email: "fred@test.com", password: "secret" });

    register.should.have.status(200);

    const userToken = await User.findById(4);

    const tokenRes = await chai
      .request(server)
      .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

    tokenRes.should.have.status(200);
  });

  describe("/POST - CATEGORY ROUTES", () => {
    describe("POST /api/v1/category/", () => {
      it("should NOT post a new category", async () => {
        const agent = chai.request.agent(server);

        const category = await agent
          .post(`/api/v1/category`)
          .set("content-type", "application/json");

        category.should.have.status(401);
      });

      it("should post a new category", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .post(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie)
          .send({ title: "birds", description: "birds from test suit" });

        category.should.have.status(200);
        category.body.should.have.property("success", true);
      });

      it("should NOT post a duplicate category", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .post(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie)
          .send({ title: "test", description: "test" });

        category.should.have.status(400);
        category.body.error.should.include.something.that.deep.equals(
          errors.categoryTitleError
        );
      });
    });
  });
  describe("/GET - CATEGORY ROUTES", () => {
    describe("GET /api/v1/category/", () => {
      it("should NOT return all categories", async () => {
        const agent = chai.request.agent(server);

        const category = await agent
          .get(`/api/v1/category`)
          .set("content-type", "application/json");

        category.should.have.status(401);
      });

      it("should return all categories", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .get(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        category.should.have.status(200);
      });
    });

    describe("GET /api/v1/category/:id/threads", () => {
      it("should NOT return categories and their threads", async () => {
        const agent = chai.request.agent(server);

        const category = await agent
          .get(`/api/v1/category/1/threads`)
          .set("content-type", "application/json");

        category.should.have.status(401);
      });
      it("should return a category and its threads", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .get(`/api/v1/category/1/threads`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        category.should.have.status(200);
      });
    });
  });

  describe("/PUT - CATEGORY ROUTES", () => {
    describe("PUT /api/v1/category/:id", () => {
      it("should NOT update a category", async () => {
        const agent = chai.request.agent(server);

        const category = await agent
          .put(`/api/v1/category/1`)
          .set("content-type", "application/json")
          .send({ title: "spiders", description: "scary" });

        category.should.have.status(401);
      });

      it("should NOT update a category if user is not an ADMIN", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .put(`/api/v1/category/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie)
          .send({ title: "spiders", description: "scary" });

        category.should.have.status(401);
      });

      it("should update a category", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .put(`/api/v1/category/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie)
          .send({ title: "spiders", description: "scary" });

        category.should.have.status(200);
      });
    });
  });

  describe("/DELETE - CATEGORY ROUTES", () => {
    describe("DELETE /api/v1/category/:id", () => {
      it("should NOT delete a category", async () => {
        const agent = chai.request.agent(server);

        const category = await agent
          .delete(`/api/v1/category/1`)
          .set("content-type", "application/json");

        category.should.have.status(401);
      });

      it("should NOT delete a category if user is not an ADMIN", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .delete(`/api/v1/category/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        category.should.have.status(401);
      });

      it("should delete a category", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .delete(`/api/v1/category/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        category.should.have.status(200);
        category.body.should.have.property("success", true);
      });
    });
  });
});
