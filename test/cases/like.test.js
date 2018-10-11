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
  before(async () => {
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
        UserId: 1,
        ThreadId: 6
      });

    post.should.have.status(200);
    post.body.should.have.property("success");
  });
  describe("/POST LIKE ROUTES", () => {
    describe("POST /api/v1/like/", () => {
      it("should NOT post a like if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

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
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ threadId: 6 });

        post.should.have.status(200);
      });
      it("should NOT like the same thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ threadId: 6 });

        post.should.have.status(400);
        post.body.error.should.include.something.that.deep.equals(
          errors.invalidLike
        );
      });
      it("should NOT like the your own thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ threadId: 6 });

        post.should.have.status(400);
        post.body.error.should.include.something.that.deep.equals(
          errors.invalidLike
        );
      });
      it("should like a post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ postId: 2 });

        post.should.have.status(200);
      });
      it("should NOT like the same post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ postId: 2 });

        post.should.have.status(400);
        post.body.error.should.include.something.that.deep.equals(
          errors.invalidLike
        );
      });
      it("should NOT like the your own post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const post = await agent
          .post(`/api/v1/like/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ postId: 2 });

        post.should.have.status(400);
        post.body.error.should.include.something.that.deep.equals(
          errors.invalidLike
        );
      });
    });
  });
});
describe("/DELETE LIKE ROUTES", () => {
  describe("DELETE /api/v1/like/remove", () => {
    it("should NOT post a like if unauthenticated", async () => {
      const agent = chai.request.agent(server);
      const post = await agent
        .delete(`/api/v1/like/remove`)
        .set("content-type", "application/json")
        .send({ threadId: 6 });

      post.should.have.status(401);
    });
    it("should NOT find a threads like", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "turtle@test.com",
        password: "test123"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const post = await agent
        .delete(`/api/v1/like/remove`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ threadId: 6 });

      post.should.have.status(400);
      post.body.error.should.include.something.that.deep.equals(
        errors.likeError
      );
    });
    it("should delete a users own like on thread", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "fred@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const newPost = await agent
        .post(`/api/v1/like`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ threadId: 2 });

      newPost.should.have.status(200);

      const post = await agent
        .delete(`/api/v1/like/remove`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ threadId: 6 });

      post.should.have.status(200);
    });
    it("should NOT find a posts like", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "fred@test.com",
        password: "secret"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const post = await agent
        .delete(`/api/v1/like/remove`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ threadId: 6 });

      post.should.have.status(400);
      post.body.error.should.include.something.that.deep.equals(
        errors.likeError
      );
    });
    it("should delete a users own post like", async () => {
      const agent = chai.request.agent(server);
      const login = await agent.post("/api/v1/user/login").send({
        email: "turtle@test.com",
        password: "test123"
      });

      login.should.have.status(200);

      const token = `Bearer ${login.body.token}`;

      const newPost = await agent
        .post(`/api/v1/like`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ postId: 3 });

      newPost.should.have.status(200);

      const post = await agent
        .delete(`/api/v1/like/remove`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({ postId: 3 });

      post.should.have.status(200);
    });
  });
});
