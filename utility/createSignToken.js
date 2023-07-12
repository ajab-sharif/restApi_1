const signToken = require('./../utility/signToken');

module.exports = function (statusCode, res, user) {
  const token = signToken(user.id);
  // remove password form output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      data: user
    }
  })
}