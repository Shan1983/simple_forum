"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const color = require("colors");
const bcrypt = require("bcryptjs");
const uuidv5 = require("uuid/v5");
const errors = require("../helpers/mainErrors");
const { sequelize, User } = require("../models");
const faker = require("faker");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("User Model", () => {
  // lets get this party started!

  before(async done => {
    if (server.locals.started) {
      done();
    }

    // server.on("started", () => {
    //   done();
    // });
  });

  after(() => sequelize.sync({ force: true }));

  describe("/ POST - user", () => {
    //let agent = chai.request.agent(server);
    it("should register a new user", async done => {
      chai
        .request(server)
        .post("/api/v1/user/register")
        .set("content-type", "application/json")
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync("secret", 10),
          emailVerificationToken: uuidv5(faker.internet.email(), uuidv5.DNS),
          emailVerified: false,
          RoleId: 1
        })
        .end((err, res) => {
          if (err) console.log(`${err}`);
          res.should.have.status(200);
          done();
        });
    });
  });
});
