exports.index = (req, res, next) => {
  try {
    res.json({ status: "OK" });
  } catch (error) {
    next(error);
  }
};

exports.login = (req, res, next) => {
  try {
    res.json({ secret: process.env.JWT_SECRET });
  } catch (error) {}
};
