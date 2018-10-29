const { Issuetracker } = require("../../models");
const errors = require("../../helpers/generalErrors");
const attributes = require("../../helpers/getModelAttributes");
const validation = require("../../helpers/validation");

exports.getAllIssues = async (req, res, next) => {
  try {
    const allIssues = await Issuetracker.findAndCountAll();
    if (allIssues.rows.length <= 0) {
      next("not issues error");
    } else {
      res.json(allIssues);
    }
  } catch (error) {
    next(error);
  }
};
exports.newIssue = async (req, res, next) => {
  try {
    const { issue, severity, notes } = req.body;
    if (
      validate.isEmpty(issue) ||
      validate.isEmpty(severity) ||
      validate.isEmpty(notes)
    ) {
      next("validation error");
    } else {
      await Issuetracker.create({
        issue,
        severity,
        notes
      });

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
exports.editIssue = async (req, res, next) => {
  try {
    const issue = await Issuetracker.findById(req.params.issue);
    if (!issue) {
      next("some issue error");
    } else {
      const issueReq = attributes.convert(issue);
      if (issueReq.UserId !== req.session.userId) {
        next("cant edit someone elses issue error");
      } else {
        await Issuetracker.update(
          {
            issue: req.body.issue,
            severity: req.body.severity,
            notes: req.body.notes
          },
          { where: { UserId: req.session.userId } }
        );

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.removeIssue = async (req, res, next) => {
  try {
    const issue = await Issuetracker.findById(req.params.issue);
    if (!issue) {
      next("some issue error");
    } else {
      const issueReq = attributes.convert(issue);
      if (issueReq.UserId !== req.session.userId) {
        next("cant delete someone elses issue error");
      } else {
        await Issuetracker.destroy(
          {
            issue: req.body.issue,
            severity: req.body.severity,
            notes: req.body.notes
          },
          { where: { UserId: req.session.userId } }
        );

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};
