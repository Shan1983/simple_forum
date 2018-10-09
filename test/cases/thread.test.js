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

describe("THREAD", () => {
  describe("/GET THREAD ROUTES", () => {
    describe("GET /thread/:threadId", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should NOT proceed if thread is locked", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const locked = await agent
          .post(`/api/v1/thread/2/lock`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reason: "SPAM", message: "Testing" });

        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        locked.should.have.status(200);

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.lockedError
        );
      });

      it("should return a thread", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;

        const thread = await agent
          .get(`/api/v1/thread/1`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(200);
        thread.body.should.have.property("title");
        thread.body.should.have.property("Posts");
        thread.body.should.have.property("discussion");
        thread.body.should.have.property("Category", "Other");
      });
    });
    describe("GET /thread/:categoryId/deleted/thread", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .get(`/api/v1/thread/1/deleted/threads`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it('should NOT proceed if users role is "Member"', async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .get(`/api/v1/thread/2/deleted/threads`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should return deleted threads", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .get(`/api/v1/thread/2/deleted/threads`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(200);
      });
    });
  });
  describe("/POST THREAD ROUTES", () => {
    describe("POST /thread/:categoryId", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .post(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should post a new thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/2`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "test thread from fred",
            slug: "test-thread-from-fred",
            category: 2,
            discussion: "big long rant about nothing in particular"
          });

        thread.should.have.status(200);
        thread.body.should.have.property("success");
      });
    });
    describe("POST /thread/:threadId/lock", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it('should NOT proceed if role is "Member"', async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/5/lock`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            reason: "test",
            message: "test"
          });

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should check if thread exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/1024/lock`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            reason: "test",
            message: "test"
          });

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.threadError
        );
      });
      it("should lock a thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/5/lock`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            reason: "Spam",
            message: "test"
          });

        thread.should.have.status(200);
        thread.body.should.have.property("success");
      });
    });
    describe("POST /thread/:threadId/make-sticky", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .get(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it('should NOT proceed if role is "Member"', async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/5/make-sticky`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reason: "test", message: "test" });

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should check if thread exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/1024/make-sticky`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.threadError
        );
      });
      it("should check if thread is locked", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/5/make-sticky`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.lockedError
        );
      });
      it("should make a thread sticky", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/3/make-sticky`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(200);
        thread.body.should.have.property("success");
      });
    });
    describe("POST /thread/:categoryId/move", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .post(`/api/v1/thread/2/move`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it('should NOT proceed if role is "Member"', async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/3/move`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ category: 2 });

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should check if category exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/3/move`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ category: 99 });

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.categoryError
        );
      });
      it("should move a thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .post(`/api/v1/thread/3/move`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ category: 2 });

        thread.should.have.status(200);
        thread.body.should.have.property("success");
      });
    });
  });
  describe("/PUT THREAD ROUTES", () => {
    describe("PUT /thread/:threadId", () => {
      it("should NOT proceed if unauthorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .put(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it("should check if thread exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .put(`/api/v1/thread/1024`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "stuff",
            slug: "stuff",
            category: 2,
            discussion: "big long rant about stuff in particular"
          });

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.threadError
        );
      });
      it("should check if the thread belongs to the user", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .put(`/api/v1/thread/5`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "stuff",
            slug: "stuff",
            category: 2,
            discussion: "big long rant about stuff in particular"
          });

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should update a thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .put(`/api/v1/thread/6`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "stuff",
            slug: "stuff",
            category: 2,
            discussion: "big long rant about stuff in particular"
          });

        thread.should.have.status(200);
      });
    });
  });
  describe("/DELETE THREAD ROUTES", () => {
    describe("DELETE /thread/:threadId", () => {
      it("should NOT proceed if unaithorised", async () => {
        const agent = chai.request.agent(server);
        const thread = await agent
          .delete(`/api/v1/thread/2`)
          .set("content-type", "application/json");

        thread.should.have.status(401);
      });
      it('should NOT proceed if role is not "Admin"', async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .delete(`/api/v1/thread/3`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(401);
        thread.body.error.should.include.something.that.deep.equals(
          errors.notAuthorized
        );
      });
      it("should check if thread exists", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .delete(`/api/v1/thread/1024`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(400);
        thread.body.error.should.include.something.that.deep.equals(
          errors.threadError
        );
      });
      it("should delete a thread", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const thread = await agent
          .delete(`/api/v1/thread/3`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        thread.should.have.status(200);
        thread.body.should.have.property("success");
      });
    });
  });
});
