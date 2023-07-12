const User = require('./../model/userModel');
const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const crypto = require('crypto');
const sendEmail = require('./../utility/email');
const createSignToken = require('./../utility/createSignToken');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { CLIENT_RENEG_LIMIT } = require('tls');

exports.singup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
  })
  createSignToken(201, res, newUser);
});

exports.login = catchAsync(async (req, res, next) => {
  // get user email form posted data 
  const { email, password } = req.body;
  // 1 check email or password exist? 
  if (!email || !password) return next(new AppError('please provide a email or password', 400));
  // check user exist or password is correct 
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('your email and password is incorrect'));
  // if everyting ok then login
  createSignToken(200, res, user);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There are no user with that user.', 404));
  // create a random reset token
  const resetToken = user.createPasswordResetToken();

  // 3) send  it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
  const message = `Forgot your password! submit a PATCH request with new password and COMFIRM PASSWORD to:${resetUrl}\n if you did't forget your password ignore this email`;
  console.log(resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your PASSWORD Reset Token! (valid for 10m)',
      message
    })
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Your token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email ! try again latter !', 500));
  }

})
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token 
  console.log(req.params.token);
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    resetTokenExpire: { $gt: Date.now() }
  })
  //  if token has not expire, and there is user, set the new password
  if (!user) return next(new AppError('Token is invlaid or has expire', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //  update changePasswordAt property for the user
  // solve => check user Schema pre hook 👍 
  user.passwordResetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();
  // log the user in, send jwt
  createSignToken(200, res, user);
});
exports.protect = catchAsync(async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) next(new AppError('You are not login! please login first to visit this site', 401));
  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check user still exist 
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Ther user belong to his token does no longer exist!', 401));
  }
  // check if user change the password after token was the issued

  /// check user model for changePasswordAfter functions 
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('Your Password Change Recently! please try again!', 401));
  }
  // access protected route
  req.user = currentUser;
  next();
});
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // 1. get user from USER collections
  const user = await User.findById(req.user.id).select('+password');
  // 2. check if posted current password is correct
  if (!await user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Current password is incorrect.', 401));
  }
  // 3. if so, update  password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4. loged user in, send jwt token
  createSignToken(200, res, user);
});
