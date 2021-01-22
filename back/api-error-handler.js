function apiErrorHandler(err, req, res, next) {
  console.error(err.message);

  res.status(400).json({ message: err.message });
}

module.exports = apiErrorHandler;
