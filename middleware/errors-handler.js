const errorResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  //   Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new errorResponse(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate value entered';
    error = new errorResponse(message, 400);
  }

  //Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
