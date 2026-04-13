const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only job seekers can apply' });
    }

    const { jobId } = req.body;
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Valid jobId is required' });
    }

    const [job, user] = await Promise.all([
      Job.findById(jobId),
      User.findById(req.user.id)
    ]);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingApplication = await Application.findOne({ jobId, userId: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      userId: user._id,
      userName: user.name,
      userPhone: user.phone || '',
      userEmail: user.email || ''
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/check/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.json({ applied: false });
    }

    const { jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job id' });
    }

    const application = await Application.findOne({ jobId, userId: req.user.id });
    res.json({ applied: Boolean(application) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/mine', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
