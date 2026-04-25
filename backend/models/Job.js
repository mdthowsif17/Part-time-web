const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  hoursOfWork: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  location: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true
  },
  contactPhone: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerName: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
