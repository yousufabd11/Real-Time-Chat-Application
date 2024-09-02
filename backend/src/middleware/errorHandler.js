const errorHandler = (err, req, res, next) => {
  // If the status code is 200 (success), change it to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set the status code in the response
  res.status(statusCode);

  // Send a JSON response with the error message and stack trace (only in development)
  res.json({
    message: err.message,
    // Include stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Export the error handler middleware to be used in your application
module.exports = errorHandler;
