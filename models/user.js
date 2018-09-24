"use strict";
// module.exports = (sequelize, DataTypes) => {
//   const user = sequelize.define(
//     "user",
//     {
//       username: DataTypes.STRING,
//       description: DataTypes.TEXT,
//       colorIcon: DataTypes.STRING,
//       password: DataTypes.STRING,
//       email: DataTypes.STRING,
//       RoleId: DataTypes.INTEGER,
//       VillageId: DataTypes.INTEGER,
//       PlayerId: DataTypes.INTEGER,
//       points: DataTypes.INTEGER,
//       facebookToken: DataTypes.STRING,
//       googleToken: DataTypes.STRING,
//       FriendId: DataTypes.INTEGER,
//       avatar: DataTypes.STRING,
//       IpId: DataTypes.INTEGER
//     },
//     {}
//   );
//   user.associate = function(models) {
//     // associations can be defined here
//   };
//   return user;
// };

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const randomColor = require("randomcolor");

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        username: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: true,
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError(
                  "Username must be a string."
                );
              }
            },
            checkBlankChars(val) {
              if (/\s/g.test(val)) {
                throw new sequelize.ValidationError(
                  "Username cannot contain blank characters."
                );
              }
            }
          }
        },
        description: {
          type: DataTypes.TEXT,
          validate: {
            len: {
              args: [1, 1024],
              msg: "Description must be between 1 and 1024 characters."
            },
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError(
                  "Username must be a string."
                );
              }
            }
          }
        },
        colorIcon: {
          type: DataTypes.STRING,
          defaultValue() {
            return randomColor();
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [6, 100],
              msg: "Password must be between 6 and 100 characters"
            },
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError(
                  "Username must be a string."
                );
              }
            }
          }
        },
        email: {
          type: DataTypes.STRING,
          unique: { msg: "Email is already registered.", fields: ["email"] },
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true,
            len: {
              args: [1, 100],
              msg: "Email must be between 1 and 100 characters"
            },
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError("Email must be a string");
              }
            }
          }
        },
        // RoleId: { type: DataTypes.INTEGER },
        // VillageId: { type: DataTypes.INTEGER },
        // PlayerId: { type: DataTypes.INTEGER },
        points: {
          type: DataTypes.INTEGER,
          validation: {
            isInt: true
          }
        },
        facebookToken: {
          type: DataTypes.STRING,
          validate: {
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError(
                  "Facebook token must be a string."
                );
              }
            }
          }
        },
        googleToken: {
          type: DataTypes.STRING,
          validate: {
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError(
                  "Google token must be a string."
                );
              }
            }
          }
        },
        // FriendId: { type: DataTypes.INTEGER },
        avatar: {
          type: DataTypes.STRING,
          validate: {
            isString(val) {
              if (typeof val !== "string") {
                throw new sequelize.ValidationError("Avatar must be a string.");
              }
            }
          }
        }
        // IpId: { type: DataTypes.INTEGER }
      },
      {
        sequelize,
        async updatePassword(sentPassword, newPassword) {
          // check to make sure the user isnt using the previous password
          if (sentPassword === newPassword) {
            throw error.passwordsAreTheSame;
          }

          // authenticate the password before updating
          const checkPassword = await bcrypt.compare(
            sentPassword,
            this.password
          );

          // if everything checks out do the update
          if (checkPassword) {
            await this.update({ password: newPassword });
          } else {
            throw error.didNotAuthenticate;
          }
        },
        // compare passwords for use with logging in etc
        async comparePasswords(sentPassword) {
          return await bcrypt.compare(sentPassword, this.password);
        },
        async getUsersMetaData(limit) {
          const Post = sequelize.Models.Post;
          let metaData = {};

          // get the id of the next post
          const nextPostId = await pagination.getNextIdOrderedByDesc(
            Post,
            { UserId: this.id },
            this.Post
          );

          // build the required url
          if (nextPostId === null) {
            metaData.URL = null;
            metaData.PostCount = 0;
          } else {
            metaData.URL = trim(
              `/api/v1/${
                this.username
              }?posts=true&limit=${limit}&from=${nextPostId - 1}`
            );
            metaData.PostCount = await pagination.getTotalPostCount(
              Post,
              this.Post,
              limit,
              { UserId: this.id },
              true
            );
          }

          return metaData;
        }
      }
    );
  }
}
