"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("POLL", () => {
  describe("POST POLL ROUTES", () => {
    describe("POST /api/v1/poll/:threadId/new", () => {
      it("should Not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const poll = await agent
          .post(`/api/v1/poll/1/new`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        poll.should.have.status(401);
      });
      it("should Not proceed if a thread does not exist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const poll = await agent
          .post(`/api/v1/poll/99/new`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(400);
      });
      it("should Not proceed if a poll has less than 2 responses", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const data = ["1"];

        const poll = await agent
          .post(`/api/v1/poll/1/new`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            question: "spiders have how many legs?",
            responses: data
          });

        poll.should.have.status(400);
      });
      it("should Not proceed if a poll has duplicate data", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const data = ["1", "1", "8"];

        const poll = await agent
          .post(`/api/v1/poll/1/new`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            question: "spiders have how many legs?",
            responses: data
          });

        poll.should.have.status(400);
      });
      it("should Not proceed if a poll question is empty", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const data = ["1", "3", "6"];

        const poll = await agent
          .post(`/api/v1/poll/1/new`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            question: "",
            responses: data
          });

        poll.should.have.status(400);
      });
      it("should create a new poll", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const data = ["1", "2", "4", "8"];

        const poll = await agent
          .post(`/api/v1/poll/1/new`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            question: "spiders have how many legs?",
            responses: data
          });

        poll.should.have.status(200);
      });
    });
    describe("POST /api/v1/poll/:pollId/:responseId/vote", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .post(`/api/v1/poll/1/1/vote`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        post.should.have.status(401);
      });
      it("should not proceed if poll does not exist");
      it("should not proceed if user has already voted");
      it("should vote on a poll");
    });
  });
  describe("GET POLL ROUTES", () => {
    describe("GET /api/v1/poll/:pollId", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .get(`/api/v1/poll/1`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        post.should.have.status(401);
      });
      it("should not proceed if poll does not exist");
      it("should return a poll");
    });
    describe("GET /api/v1/poll/", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .get(`/api/v1/poll/`)
          .set("content-type", "application/json");

        post.should.have.status(401);
      });
      it("should only be accessed by a leader");
      it("should return all polls");
    });
    describe("GET /api/v1/poll/:pollId/results", () => {
      it("should not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .get(`/api/v1/poll/1/results`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        post.should.have.status(401);
      });
      it("should return a polls current result");
    });
  });
  describe("PUT POLL ROUTES", () => {
    describe("PUT /api/v1/poll/:pollId", () => {
      it("should Not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .put(`/api/v1/poll/1/`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        post.should.have.status(401);
      });
      it("should Not proceed if a thread doesnot exist");
      it("should Not proceed if a poll has less than 2 responses");
      it("should Not proceed if a poll has duplicate data");
      it("should Not proceed if a poll question is empty");
      it("should update a poll");
    });
  });
  describe("DELETE POLL ROUTES", () => {
    describe("DELETE /api/v1/poll/:pollId/remove", () => {
      it("should Not proceed if not authenticated", async () => {
        const agent = chai.request.agent(server);

        const post = await agent
          .delete(`/api/v1/poll/1/remove`)
          .set("content-type", "application/json")
          .send({ threadId: 6 });

        post.should.have.status(401);
      });
      it("should only be accessed by a leader");
      it("should delete a poll");
    });
  });
});
