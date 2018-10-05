"use strict";
process.env.NODE_ENV = "test";
const server = require("../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
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

    describe("POST /api/v1/user/register", () => {
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

      it("should prevent a user signing up if the email is taken", done => {
        chai
          .request(server)
          .post("/api/v1/user/register")
          .set("content-type", "application/json")
          .send({ username, email, password, RoleId: 1 })
          .end((err, res) => {
            if (err) console.log(`${err}`);
            res.should.have.status(400);
            res.body.error.should.include.something.that.deep.equals(
              errors.accountExists
            );
            done();
          });
      });

      it("should prevent a user signing up if they don't supply the required information", done => {
        chai
          .request(server)
          .post("/api/v1/user/register")
          .set("content-type", "application/json")
          .send({ username, email: "", password, RoleId: 1 })
          .end((err, res) => {
            if (err) console.log(`${err}`);
            res.should.have.status(400);
            res.body.error.should.include.something.that.deep.equals(
              errors.invalidRegister
            );
            done();
          });
      });
    });

    describe("POST /api/v1/user/login", () => {
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
        const userToken = await User.findById(3);

        const tokenRes = await chai
          .request(server)
          .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

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

      it('should assign the user a role of "moderator"', async () => {
        const userToken = await User.findById(2);

        const tokenRes = await chai
          .request(server)
          .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

        tokenRes.should.have.status(200);

        const modRes = await chai
          .request(server)
          .post("/api/v1/user/login")
          .set("content-type", "application/json")
          .send({
            email: "moderator@test.com",
            password: "secret"
          });

        modRes.should.have.status(200);
        modRes.body.should.have.property("success", true);
        modRes.body.should.have.property("role", "Moderator");
      });

      it('should assign the user a role of "admin"', async () => {
        const userToken = await User.findById(1);

        const tokenRes = await chai
          .request(server)
          .get("/api/v1/user/verify/email/" + userToken.emailVerificationToken);

        tokenRes.should.have.status(200);

        const memberRes = await chai
          .request(server)
          .post("/api/v1/user/login")
          .set("content-type", "application/json")
          .send({
            email: "shan@test.com",
            password: "secret"
          });

        memberRes.should.have.status(200);
        memberRes.body.should.have.property("success", true);
        memberRes.body.should.have.property("role", "Admin");
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

      it("should prevent a user logging in if their login details are incorrect", async () => {
        const res = await chai
          .request(server)
          .post("/api/v1/user/login")
          .set("content-type", "application/json")
          .send({
            email,
            password: "spiders"
          });

        res.should.have.status(401);
        res.body.error.should.include.something.that.deep.equals(
          errors.loginError
        );
      });
    });

    describe("POST /api/v1/user/logout", () => {
      it("should allow a user to logout", done => {
        chai
          .request(server)
          .post("/api/v1/user/logout")
          .set("content-type", "application/json")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("success", true);
            res.body.should.have.property(
              "message",
              "You have been logged out."
            );

            done();
          });
      });
    });
  });

  describe("/GET - USER ROUTES", () => {
    describe("GET /api/v1/user/all", () => {
      it("ADMIN: should return a list of users", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email: "shan@test.com",
          password: "secret"
        });

        user.should.have.status(200);
        user.body.should.have.property("success", true);
        user.body.should.have.property("username", "Shan");
        user.body.should.have.property("role", "Admin");
        user.body.should.have.property("token");

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const res = await agent
          .get("/api/v1/user/all")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        res.should.be.json;
        res.should.have.status(200);
        res.body.should.have.property("length", res.body.length);
        res.body[0].should.have.deep.property("username", "Shan");
        res.body[1].should.have.deep.property("username", "moderator");
        res.body[2].should.have.deep.property("username", username);
      });
      it("should NOT return a list of users", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email,
          password
        });

        user.should.have.status(200);
        user.body.should.have.property("success", true);
        user.body.should.have.property("username", username);
        user.body.should.have.property("role", "Member");
        user.body.should.have.property("token");

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const res = await agent
          .get("/api/v1/user/all")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        res.should.be.json;
        res.should.have.status(401);
      });
    });
    describe("GET /api/v1/user/profile/:username", () => {
      it("should show the users profile", async () => {
        const agent = chai.request.agent(server);

        const user = await agent.post("/api/v1/user/login").send({
          email,
          password
        });

        user.should.have.status(200);
        user.body.should.have.property("success", true);
        user.body.should.have.property("username", username);
        user.body.should.have.property("role", "Member");
        user.body.should.have.property("token");

        const token = `Bearer ${user.body.token}`;
        const cookie = `token=${user.body.token}`;

        const res = await agent
          .get(`/api/v1/user/profile/${username}`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .set("Cookie", cookie);

        res.should.be.json;
        res.should.have.status(200);
        res.body.should.have.deep.property("username", username);
        res.body.should.not.have.deep.property("password");
      });
    });
  });

  describe("/PUT - USER ROUTES", () => {
    describe("PUT /api/v1/user/profile/:username", () => {
      it("should update a users profile", done => {});
      it("should NOT update a users profile", done => {});
    });
  });

  describe("/DELETE - USER ROUTES", () => {
    describe("DELETE /profile/:username/close", () => {
      it("should close a user account", done => {});
    });
    describe("DELETE /profile/:username/", () => {
      it("should permanently delete a user", done => {});
    });
  });
});
