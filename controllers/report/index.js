const { Report, Thread } = require("../../models");
const attributes = require("../../helpers/getModelAttributes");

// "/";
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.findAndCountAll();

    const reportObj = reports.map(async r => {
      const thread = await Thread.findOne({
        where: { id: r.ThreadId }
      });
      const threadReq = attributes.convert(thread);
      return {
        Thread: threadReq.title,
        post: r.PostId,
        reason: r.reason,
        complaint: r.complaint,
        submittedBy: r.submittedBy
      };
    });

    Promise.all(reportObj).then(report => res.json(report));
  } catch (error) {
    next(error);
  }
};
// "/:threadId"
exports.createNewReport = async (req, res, next) => {
  try {
    const { reason, complaint } = req.body;

    // create a new report
    await Report.create({
      ThreadId: req.params.threadId,
      reason,
      complaint,
      submittedBy: req.session.username
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// "/:postId"
exports.createNewReport = async (req, res, next) => {
  try {
    const { reason, complaint } = req.body;

    // create a new report
    await Report.create({
      ThreadId: req.params.threadId,
      PostId: req.params.postId,
      reason,
      complaint,
      submittedBy: req.session.username
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/:reportId"
exports.removeReport = async (req, res, next) => {
  try {
    await Report.destroy({ where: { id: req.params.reportId } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
