const wrapper = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    return result;
  } catch (err) {
    switch (err.name) {
      case "ValidationError":
        res
          .status(400)
          .json({ status: "error", code: 400, message: err.message });
        break;
      case "CustomError":
        res
          .status(err.status)
          .json({ status: "error", code: err.status, message: err.message });
        break;
      default:
        next(err);
        break;
    }
  }
};

module.exports = wrapper;
