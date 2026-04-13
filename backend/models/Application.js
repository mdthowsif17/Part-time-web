const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
