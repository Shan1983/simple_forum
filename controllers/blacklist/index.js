const { Blacklist } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");
const validate = require("../../helpers/validation");

// "/";
exports.getBlacklist = async (req, res, next) => {
  try {
    // grab everyone in the blacklist
    const blacklist = await Blacklist.findAndCountAll();

    if (blacklist.length <= 0) {
      res.status(400);
      res.json({ error: [errors.blacklistError] });
    } else {
      res.json(blacklist);
    }
  } catch (error) {
    next(error);
  }
};
// "/";
exports.addToBlacklist = async (req, res, next) => {
  try {
    const { playerTag, currentName, reason } = req.body;

    // validate the inputs
    if (
      validate.isEmpty(playerTag) &&
      validate.isEmpty(currentName) &&
      validate.isEmpty(reason)
    ) {
      res.status(400);
      res.json({ error: [errors.blacklistValidationError] });
    } else {
      // add a new person to the black list
      await Blacklist.create({
        playerTag,
        currentName,
        previousName: currentName,
        reason
      });

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
// "/:id";
exports.removeFromBlacklist = async (req, res, next) => {
  try {
    const { playerTag } = req.body;

    // grab a user in the list
    const user = await Blacklist.findOne({
      where: { playerTag }
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const userReq = attributes.convert(user);
      // remove them from the list - maybe discuss this with everyone first..
      await Blacklist.destroy({ where: { id: userReq.id } });

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
