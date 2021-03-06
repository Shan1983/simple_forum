const { PenaltyBox, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

// "/"
exports.getAllInBox = async (req, res, next) => {
  try {
    const penaltyBox = await PenaltyBox.findAndCountAll({
      include: [{ model: User, exclude: ["password"] }]
    });

    if (penaltyBox.length <= 0) {
      next(errors.noUsers);
    } else {
      res.json(penaltyBox);
    }
  } catch (error) {
    next(error);
  }
};

// "/:userId"
exports.putAUserInTheBox = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId }
    });

    const userReq = attributes.convert(user);

    if (!user) {
      next(errors.accountNotExists);
    } else {
      const { duration, severity, reason } = req.body;

      if (severity === "HIGH") {
        await PenaltyBox.create({
          UserId: req.params.userId,
          duration,
          reason,
          userCanCreatePost: true,
          userCanCreateThread: true,
          severity
        });

        res.json({
          success: true,
          message: `You have added ${
            userReq.username
          } to the penalty box for ${duration} days.`
        });
      } else {
        await PenaltyBox.create({
          UserId: req.params.userId,
          duration,
          reason,
          userCanCreatePost: false,
          userCanCreateThread: true,
          severity
        });

        res.json({
          success: true,
          message: `You have added ${
            userReq.username
          } to the penalty box for ${duration} days.`
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
// "/:userId"
exports.removeAUserFromBox = async (req, res, next) => {
  try {
    const user = await PenaltyBox.findOne({
      where: { UserId: req.params.userId }
    });

    if (!user) {
      next(errors.accountNotExists);
    } else {
      await PenaltyBox.destroy({
        where: { UserId: req.params.userId }
      });

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
