"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("POST", () => {
  describe("/POST POST ROUTES", () => {
    describe("POST /post/:threadId", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const post = await agent
          .post(`/api/v1/post/2`)
          .set("content-type", "application/json");

        post.should.have.status(401);
      });
      it("should post a new post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
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

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
    describe("POST /post/:threadId/best", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .post(`/api/v1/post/1/best`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should not proceed if the user is NOT the OP", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/post/1/best`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(401);
      });
      it("should mark a post as the best", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/post/1/best`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
    describe("POST /:threadId/postId/quote", () => {
      it("should NOT proceed if not authorized", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .post(`/api/v1/post/1/1/quote`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should NOT proceed if post NOT exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/post/1/99/quote`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(400);
      });
      it("should NOT proceed if thread NOT exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/post/99/1/quote`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(400);
      });
      it("should create a new post including the quote", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/post/1/1/quote`)
          .set("content-type", "application/json")
          .set("Authorization", token)

          .send({ discussion: "test" });

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
  });
  describe("/PUT POST ROUTES", () => {
    describe("PUT /:postId", () => {
      it("should not proceed if not authenitcated", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .put(`/api/v1/post/1`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should not proceed if post is NOT found", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .put(`/api/v1/post/99`)
          .set("content-type", "application/json")
          .set("Authorization", token)

          .send({ discussion: "test" });

        post.should.have.status(400);
      });
      it("should not update if user is NOT OP", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .put(`/api/v1/post/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)

          .send({ discussion: "test" });

        post.should.have.status(401);
      });
      it("should update a post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .put(`/api/v1/post/1`)
          .set("content-type", "application/json")
          .set("Authorization", token)

          .send({ discussion: "updated!" });

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
  });
  describe("/DELETE POST ROUTES", () => {
    describe("DELETE /:postId", () => {
      it("should not proceed if not authenitcated", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .delete(`/api/v1/post/1`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should not proceed if post is NOT found", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .delete(`/api/v1/post/99`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(400);
      });
      it("should not update if user is NOT an ADMIN", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .delete(`/api/v1/post/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(401);
      });
      it("should delete a post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .delete(`/api/v1/post/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        post.should.have.status(200);
        post.body.should.have.property("success");
      });
    });
  });
});
