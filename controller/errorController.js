const AppError = require('./../utility/appError');

const handleDuplicateErrorDB = (err) => {
  let name = Object.keys(err.keyValue)[0]
  let value = err.keyValue[name]
  let message = `Dublicate value: ${value} please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = err.message;
  return new AppError(message, 400);
};
const handleCastErrorDB = err => {
  const msg = `invlid ${err.path} : ${err.value}`;
  return new AppError(msg, 400);
}
const handleJsonWebTokenError = function () {
  return new AppError('Your token invalid , please login again!', 401);
};

const handleTokenExpiredError = function () {
  return new AppError('Your has been expired , please login again!', 401);
}

const errorSendProd = (err, req, res) => {

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}
const errorSendDev = (err, req, res) => {
  console.log({ err });
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack
  });
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorSendDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'castError') error = handleCastErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(err);
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError(err);
    errorSendProd(error, req, res);
  }
}