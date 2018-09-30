exports.getTest = (req, res, next) => {
  try {
    console.log("testing..");
    res.json({ status: "OK" });
  } catch (e) {
    next(e);
  }
};
