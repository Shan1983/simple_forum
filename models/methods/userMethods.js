const sequelize = require("sequelize");
const postOptions = require("./postMethods");
const bcrypt = require("bcryptjs");
const pagination = require("../../helpers/pagination");
const errors = require("../../helpers/mainErrors");

modules.exports = {
  async updatePassword(sentPassword, newPassword) {
    // check to make sure the user isnt using the previous password
    if (sentPassword === newPassword) {
      throw errors.passwordsAreTheSame;
    }

    // authenticate the password before updating
    const checkPassword = await bcrypt.compare(sentPassword, this.password);

    // if everything checks out do the update
    if (checkPassword) {
      await this.update({ password: newPassword });
    } else {
      throw errors.notAuthenticated;
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
        `/api/v1/${this.username}?posts=true&limit=${limit}&from=${nextPostId -
          1}`
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
  },

  // return users posts
  userOptions(from, limit) {
    const models = sequelize.models;

    return [
      {
        model: models.Post,
        include: postOptions,
        limit,
        where: { postNumber: { $gte: from } },
        order: [["id", "ASC"]]
      }
    ];
  }
};
