"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const should = chai.should();
const errors = require("../helpers/mainErrors");
const jwtHelper = require("../helpers/jwtHelper");
const { User } = require("../models");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const bcrypt = require("bcryptjs");
const faker = require("faker");

const username = faker.internet.userName();
const email = faker.internet.email();
const password = bcrypt.hashSync("secret", 10);

const login = async (email, password) =>
  await chai
    .request(server)
    .post("/api/v1/user/login")
    .set("content-type", "application/json")
    .send({
      email,
      password
    });

describe("USER", () => {
  // lets get this party started!

  // before(done => {
  //   if (server.locals.started) {
  //     done();
  //   }

  //   // server.on("started", () => {
  //   //   done();
  //   // });
  // });

  describe("/POST - USER ROUTES", () => {
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

    it("should fail while awaiting email verification", done => {
      chai
        .request(server)
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email,
          password
        })
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
      const userToken = await User.findById(2);

      const tokenRes = await chai
        .request(server)
        .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

      tokenRes.should.have.status(200);

      const memberRes = await login(email, password);

      memberRes.should.have.status(200);
      memberRes.body.should.have.property("success", true);
      memberRes.body.should.have.property("role", "Member");
    });

    it("should allow a user to login", async () => {
      const res = await login(email, password);

      res.should.have.status(200);
      res.body.should.have.property("success", true);
      res.body.should.have.property("username", username);
      res.body.should.have.property("role", "Member");
      res.body.should.have.property("token");
    });
  });

  describe("/GET - USER ROUTES", () => {
    it("should return a list of users - must be admin", done => {});
    it("should NOT return a list of users", async () => {
      // 1. log in
      // 2. check the users role
      // 3. return not authorized error
    });
  });
});
