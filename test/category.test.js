"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../helpers/mainErrors");
const jwtHelper = require("../helpers/jwtHelper");
const { User, Category } = require("../models");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const bcrypt = require("bcryptjs");
const faker = require("faker");

const username = faker.internet.userName();
const email = faker.internet.email();
const password = bcrypt.hashSync("secret", 10);

describe("Category", () => {
  describe("/GET - CATEGORY ROUTES", () => {
    describe("GET /api/v1/category/", () => {
      it("should NOT return all categories", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "shan@test.com",
          password: "secret"
        });

        user.should.have.status(200);

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const category = await agent
          .get(`/api/v1/category`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        category.should.have.status(400);
        category.body.errors.should.include.something.that.deep.equals(
          errors.categoryError
        );
      });

      it("should return all categories", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "shan@test.com",
          password: "secret"
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
  });
});
