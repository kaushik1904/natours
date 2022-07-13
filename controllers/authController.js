const { promisify } = require('util');
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

exports.protect = catchAsync(async (req, res, next) => {
  // 1.getting token and check of it's there
  let token;
  if (
    req.headers.authorication &&
    req.headers.authorication.startsWith('Bearer')
  ) {
    token = req.headers.authorication.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('Your are not log in! Please login to get access.', 401)
    );
  }

  // 2.verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3.check if it user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError(
      'The user belonging to this token does no longer exist',
      401
    ));
  }
  // 4.check if user changed password after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  req.user = freshUser;
  next();
});
