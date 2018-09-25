"use strict";

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

const fs = require("fs"); // file system for grabbing files
const path = require("path"); // better than '\/..\/' for portability
const Sequelize = require("sequelize"); // Sequelize is a constructor
const env = process.env.NODE_ENV || "development"; // use process environment
const config = require(path.join(__dirname, "..", "config.js"))[env]; // Use the .config.json file in the parent folder
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect
  }
);

// Load each model file
const models = Object.assign(
  {},
  ...fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
    .map(function(file) {
      const model = require(path.join(__dirname, file));
      console.log(model.init(sequelize).tableName);
      return {
        [model.name]: model.init(sequelize)
      };
    })
);

// Load model associations
for (const model of Object.keys(models)) {
  typeof models[model].associate === "function" &&
    models[model].associate(models);
}

module.exports = models;
