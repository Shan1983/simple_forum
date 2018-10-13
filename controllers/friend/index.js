const { Friend, FriendPending, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

// "/:userId/all";
exports.getAllUserFriends = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
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
        const data = user.getAttributes(user);

        // find the friends account

        const friend = await User.findOne({
          where: { id: data.Friend.acceptingFriend },
          exlude: ["password"]
        });

        const friendData = friend.getAttributes(friend);

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
            requestFromId: data.id,
            username: data.username,
            avatar: data.avatar,
            colorIcon: data.colorIcon,
            requestTo: friendData.id,
            friendUsername: friendData.username,
            friendAvatar: friendData.avatar,
            friendColorIcon: friendData.colorIcon,
            friendFromDate: date.rows.createdAt
          };

          // return the data
          res.json({ friends });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/accept";
exports.accept = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      // get the requestFrom user
      const requestFromUser = await User.findById(req.params.userId);

      if (!requestFromUser) {
        res.status(400);
        res.json({ error: [errors.accountNotExists] });
      } else {
        // find the pending request
        const requestUser = requestFromUser.getAttributes(requestFromUser);
        const pending = await FriendPending.findAll({
          where: { requestTo: req.session.userId, requestFrom: requestUser.id }
        });

        if (!pending) {
          res.status(400);
          res.json({ error: [errors.friendRequestError] });
        } else {
          // update friendpending with accepted true
          await pending.update({ accept: true });
          // create new friend with both user id's
          await Friend.create({
            requestingFriend: requestUser.id,
            acceptingFriend: req.session.userId
          });
          // return success
          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/decline";
exports.decline = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      // get the requestFrom user
      const request = await User.findById(req.params.userId);

      if (!request) {
        res.status(400);
        res.json({ error: [errors.accountNotExists] });
      } else {
        // find the pending request
        const pending = await FriendPending.findAll({
          where: { requestTo: req.session.userId, requestFrom: requestUser.id }
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
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId/new"
exports.addFriend = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      // get the requestTo user
      const requestToUser = await User.findById(req.params.userId);

      if (!requestToUser) {
        // return any errors
        res.status(400);
        res.json({ error: [errors.accountNotExists] });
      } else {
        const reqUserAttributes = requestToUser.getAttributes(requestToUser);
        // assign username the requestFrom user, and fill in the rest
        const request = await FriendPending.create({
          username: req.session.username,
          requestTo: reqUserAttributes.id,
          requestFrom: req.session.userId,
          accepted: false
        });

        // convert request
        attributes.convert(request);

        requestToUser.update({ FriendPendingId: request.id });

        // send socket alert..

        // return success
        res.json({ success: true });
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
// "/:fromId/:toId/remove"
exports.removeFriend = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
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
            acceptinfFriend: req.params.toId
          }
        });

        await pending.destroy();
        await friendship.destroy();

        // return success

        res.json({ success: true });
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
