const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});
