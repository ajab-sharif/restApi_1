const catchAsync = require('./../utility/catchAsync');
const AppError = require('./../utility/appError');
const User = require('./../model/userModel');
const createSignToken = require('./../utility/createSignToken');

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = Obj[el];
    }
  });
  return newObj;
};


exports.updateMe = catchAsync(async (req, res, next) => {
  // check if user posted Password DATA 
  if (
    req.body.password ||
    req.body.passwordConfirm)
    return next(new AppError("This route not for password update! Please use /updateMyPassword.", 400));
  // update data
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
  // send data 
  createSignToken(203, res, updatedUser);
});