const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

const signInToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo
  });

  const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1.check email and password are not empty
  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  // 2.check correct password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3.token
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});
