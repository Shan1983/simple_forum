const { Friend, FriendPending, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

// "/:userId/all";
exports.getAllUserFriends = async (req, res, next) => {
  try {
    // find the user and include friendships
    const user = await User.findOne({
      where: { id: req.params.userId },
      exlude: ["password"],
      include: [
        { model: Friend, attributes: ["requestingFriend", "acceptingFriend"] }
      ]
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      // format what will be returned
      const userReq = attributes.convert(user);

      // find the friends account

      const friend = await User.findOne({
        where: { id: userReq.Friend.acceptingFriend },
        exlude: ["password"]
      });

      const friendReq = attributes.convert(friend);

      if (!friend) {
        res.status(400);
        res.json({ error: [errors.accountNotExists] });
      } else {
        // get the createdAt date for friendship
        const date = await FriendPending.findAll({
          where: {
            requestTo: data.id,
            requestFrom: data.Friend.acceptingFriend
          }
        });
        // build the returning object

        const friends = {
          requestFromId: userReq.id,
          username: userReq.username,
          avatar: userReq.avatar,
          colorIcon: userReq.colorIcon,
          requestTo: friendReq.id,
          friendUsername: friendReq.username,
          friendAvatar: friendReq.avatar,
          friendColorIcon: friendReq.colorIcon,
          friendFromDate: date.rows.createdAt
        };

        // return the data
        res.json({ friends });
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
          requestTo: req.session.userId,
          requestFrom: requestUserReq.id
        }
      });

      if (!pending) {
        res.status(400);
        res.json({ error: [errors.friendRequestError] });
      } else {
        // update friendpending with accepted true
        await pending.update({ accept: true });
        // create new friend with both user id's
        await Friend.create({
          requestingFriend: requestUserReq.id,
          acceptingFriend: req.session.userId
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
        where: { requestTo: req.session.userId, requestFrom: userReq.id }
      });

      if (!pending) {
        res.status(400);
        res.json({ error: [errors.friendRequestError] });
      } else {
        // destroy the request
        await pending.destroy();
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
        requestFrom: req.session.userId,
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
      where: { requestTo: req.params.fromId, requestFrom: req.params.toId }
    });

    if (!pending) {
      res.status(400);
      res.json({ error: [errors.friendRequestError] });
    } else {
      // remove from friend
      const friendship = await Friend.findAll({
        where: {
          requestingFriend: req.params.fromId,
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
