const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: 8,
    select:false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate:{
      validator: function(el){
        return el === this.password;
      },
      message: 'Password are not same!'
    }
  }
});

userSchema.pre('save',async function(next){
  if(! this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;