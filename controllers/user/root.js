exports.root = (req, res, next) => {
  try {
    res.json({ status: "OK" });
  } catch (e) {
    next(e);
  }
};
