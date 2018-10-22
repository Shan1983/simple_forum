"use strict";
process.env.NODE_ENV = "test";
const server = require("../../server");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const errors = require("../../helpers/mainErrors");

chai.use(require("chai-http"));
chai.use(require("chai-things"));
