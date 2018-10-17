const { Friend, FriendPending, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

// "/:userId/all";
exports.getAllUserFriends = async (req, res, next) => {
  try {
    // find the user and include friendships
    const me = await User.findOne({
      where: { id: req.params.userId },
      exclude: ["password"],
      include: [{ model: Friend, attributes: ["UserId", "acceptingFriend"] }]
    });

    console.log("after finding user");

    if (!me) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      // format what will be returned
      const userReq = attributes.convert(me);

      console.log(userReq);

      // find the friends account

      let friendObj = {};

      userReq.Friends.map(async f => {
        const friend = await User.findOne({
          where: { id: f.acceptingFriend },
          exclude: ["password"]
        });
        console.log("found friend!", await attributes.convert(friend));
        // put the found friend in the obj
      });

      console.log("friends", friendArray);

      if (friendArray.length <= 0) {
        res.status(400);
        res.json({ error: [errors.accountNotExists] });
      } else {
        // return the data
        res.json({ friendArray });
      }
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/accept";
exports.accept = async (req, res, next) => {
  try {
    // get the requestFrom user
    const requestFromUser = await User.findById(req.params.userId);

    if (!requestFromUser) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      // find the pending request
      const requestUserReq = attributes.convert(requestFromUser);

      const pending = await FriendPending.findAll({
        where: {
          requestTo: requestUserReq.id,
          UserId: req.session.userId
        }
      });

      if (pending.length <= 0) {
        res.status(400);
        res.json({ error: [errors.friendRequestError] });
      } else {
        // update friendpending with accepted true
        await FriendPending.update(
          { accepted: true },
          {
            where: {
              requestTo: requestUserReq.id,
              UserId: req.session.userId
            }
          }
        );
        // create new friend with both user id's
        await Friend.create({
          UserId: req.session.userId,
          acceptingFriend: requestUserReq.id
        });
        // return success
        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/decline";
exports.decline = async (req, res, next) => {
  try {
    // get the requestFrom user
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const userReq = attributes.convert(user);
      // find the pending request
      const pending = await FriendPending.findAll({
        where: { requestTo: userReq.id, UserId: req.session.userId }
      });

      if (pending.length <= 0) {
        res.status(400);
        res.json({ error: [errors.friendRequestError] });
      } else {
        // destroy the request
        await FriendPending.destroy({
          where: {
            requestTo: userReq.id,
            UserId: req.session.userId
          }
        });
        // return success
        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/new"
exports.addFriend = async (req, res, next) => {
  try {
    // get the requestTo user
    const requestToUser = await User.findById(req.params.userId);

    if (!requestToUser) {
      // return any errors
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const userReq = attributes.convert(requestToUser);
      // assign username the requestFrom user, and fill in the rest
      const request = await FriendPending.create({
        username: req.session.username,
        requestTo: userReq.id,
        UserId: req.session.userId,
        accepted: false
      });

      // convert request
      const requestReq = attributes.convert(request);

      requestToUser.update({ FriendPendingId: requestReq.id });

      // send socket alert..

      // return success
      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
// "/:fromId/:toId/remove"
exports.removeFriend = async (req, res, next) => {
  try {
    // remove from friend pending
    const pending = await FriendPending.findAll({
      where: { requestTo: req.params.fromId, UserId: req.params.toId }
    });

    if (!pending) {
      res.status(400);
      res.json({ error: [errors.friendRequestError] });
    } else {
      // remove from friend
      const friendship = await Friend.findAll({
        where: {
          UserId: req.params.fromId,
          acceptingFriend: req.params.toId
        }
      });

      await pending.destroy();
      await friendship.destroy();

      // return success

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
