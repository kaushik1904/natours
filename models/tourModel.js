const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    requried: [true, 'A tour must have a unique name'],
  },
  duration: {
    type: Number,
    requried: [true, 'A tour must have a duration'],
  },

  maxGroupSize: {
    type: Number,
    requried: [true, 'A tour must have a  group size'],
  },
  difficulty: {
    type: String,
    requried: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuality: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    requried: [true, 'A tour must have price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    requried: [true, 'A tour must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    requried: [true, 'A tour must have cover image'],
  },
  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
