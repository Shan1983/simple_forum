"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("SETTING ROUTES", () => {
  describe("/GET SETTING ROUTES", () => {
    describe("GET /api/v1/setting/", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .get(`/api/v1/setting/`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .get(`/api/v1/setting/`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should return all settings", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .get(`/api/v1/setting/`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ userId: 5, reason: "being naughty" });

        setting.should.have.status(200);
      });
    });
    describe("GET /api/v1/setting/clan-shield", () => {
      it("should return the clan shield");
    });
  });
  describe("/POST SETTING ROUTES", () => {
    describe("POST /api/v1/setting/forum-name", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/forum-name`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/forum-name`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should change the forums name", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/forum-name`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ forumName: "forum name changed" });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/forum-description", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/forum-description`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/forum-description`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update the forums description", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/forum-description`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ forumDescription: "forum description changed" });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/show-description", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/show-description`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-description`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update show description", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/forum-description`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ showDescription: false });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/show-clan-size", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/show-clan-size`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-clan-size`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update show clan size", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-clan-size`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ showClanSize: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/show-blacklist", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/show-blacklist`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-blacklist`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update show blacklist", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-blacklist`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ showBlacklist: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/show-clan-shield", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/show-clan-shield`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-clan-shield`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update show clan size", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/show-clan-shield`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ showBlacklist: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/maintenance", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/maintenance`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/maintenance`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update maintenance", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/maintenance`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ maintenance: true });

        setting.should.have.status(200);
      });
      it("should maintenance mode should be active", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/maintenance`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ maintenance: true });

        setting.should.have.status(200);

        const category = await agent
          .get(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        category.should.have.status(503);

        const setting2 = await agent
          .post(`/api/v1/setting/maintenance`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ maintenance: false });

        setting2.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/lock-forum", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/lock-forum`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/lock-forum`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update lock forum", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/lock-forum`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ lockForum: true });

        setting.should.have.status(200);
      });
      it("should make forum unavaliable", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/lock-forum`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ lockForum: true });

        setting.should.have.status(200);

        const category = await agent
          .get(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        category.should.have.status(503);

        const setting2 = await agent
          .post(`/api/v1/setting/lock-forum`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ lockForum: false });

        setting2.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/allow-best-post", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/allow-best-post`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-best-post`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update allow best post", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-best-post`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ allowBestPosts: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/allow-email-subscriptions", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/allow-email-subscriptions`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-email-subscriptions`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update allow email subscriptions", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-email-subscriptions`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ allowSubscriptions: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/repost-time", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/repost-time`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/repost-time`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update report time", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/repost-time`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ repostingDuration: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/allow-likes", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/allow-likes`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-likes`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update allow likes", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-likes`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ allowLikes: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/editor", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/editor`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/editor`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update the editor", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/editor`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ editor: "Plain Editor" });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/set-admin", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/set-admin`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/set-admin`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update setting the admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/set-admin`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ setAdminUser: 1 });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/set-word-limit", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/set-word-limit`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/set-word-limit`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update setting the word limit", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/set-word-limit`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ setMaxDiscussionWordLimit: 140 });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/allow-subscriptions", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/allow-subscriptions`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-subscriptions`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update allowing subscriptions", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-subscriptions`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ allowSubscriptions: true });

        setting.should.have.status(200);
      });
    });
    describe("POST /api/v1/setting/allow-sticky-posts", () => {
      it("should not proceed if unauthenticated", async () => {
        const agent = chai.request.agent(server);

        const setting = await agent
          .post(`/api/v1/setting/allow-sticky-posts`)
          .set("content-type", "application/json");

        setting.should.have.status(401);
      });
      it("should not proceed if user is not an admin", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "fred@test.com",
          password: "secret"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-sticky-posts`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        setting.should.have.status(401);
      });
      it("should update allowing sticky posts", async () => {
        const agent = chai.request.agent(server);
        const login = await agent.post("/api/v1/user/login").send({
          email: "turtle@test.com",
          password: "test123"
        });

        login.should.have.status(200);

        const token = `Bearer ${login.body.token}`;

        const setting = await agent
          .post(`/api/v1/setting/allow-sticky-posts`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ allowStickyThreads: true });

        setting.should.have.status(200);
      });
    });
  });
});
