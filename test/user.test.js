"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const should = chai.should();
const bcrypt = require("bcryptjs");
const uuidv5 = require("uuid/v5");
const errors = require("../helpers/mainErrors");
const faker = require("faker");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

describe("User Routes", () => {
  // lets get this party started!

  before(async done => {
    if (server.locals.started) {
      done();
    }

    // server.on("started", () => {
    //   done();
    // });
  });

  describe("/ POST - user", () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = bcrypt.hashSync("secret", 10);
    const token = uuidv5(email, uuidv5.DNS);
    //let agent = chai.request.agent(server);
    it("should register a new user", done => {
      chai
        .request(server)
        .post("/api/v1/user/register")
        .set("content-type", "application/json")
        .send({
          username,
          email,
          password,
          emailVerificationToken: token,
          emailVerified: false,
          RoleId: 1
        })
        .end((err, res) => {
          if (err) console.log(`${err}`);
          res.should.have.status(200);
          res.body.should.have.property("message");
          res.body.should.have.property("path");
          done();
        });
    });

    it("should prevent a user from logging in", done => {
      chai
        .request(server)
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({ email, password })
        .end((err, res) => {
          res.should.have.status(400);
          // console.log(res);
          res.body.error.should.include.something.that.deep.equals(
            errors.verifyAccountError
          );

          done();
        });
    });

    it('should assign the user a role of "member"', async () => {
      const tokenRes = await chai
        .request(server)
        .get("/api/v1/user/verify/email/" + token);

      tokenRes.should.have.status(200);

      const memberRes = await chai
        .request(server)
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email,
          password
        });

      memberRes.should.have.status(200);
      memberRes.body.should.have.property("success", true);
      memberRes.body.should.have.property("role", "Member");
    });

    it("should allow a user to login", async () => {
      const res = await chai
        .request(server)
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email,
          password
        });

      res.should.have.status(200);
      res.body.should.have.property("success", true);
      res.body.should.have.property("username", username);
      res.body.should.have.property("role", "Member");
      res.body.should.have.property("token");
    });
  });
});
