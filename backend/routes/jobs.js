const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let query = { date: { $gte: today } };
    if (req.query.filter === 'today') query.date = today;

    const jobs = await Job.find(query).sort({ date: 1, createdAt: -1 });

    const jobsWithCount = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ jobId: job._id });
      return { ...job.toObject(), applicantCount: count };
    }));

    res.json(jobsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/jobs/employer/myjobs
router.get('/employer/myjobs', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

    const jobsWithCount = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ jobId: job._id });
      return { ...job.toObject(), applicantCount: count };
    }));

    res.json(jobsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const count = await Application.countDocuments({ jobId: job._id });
    res.json({ ...job.toObject(), applicantCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/jobs
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }
    const { title, date, time, hoursOfWork, location, salary, contactPhone, contactEmail } = req.body;
    if (!title || !date || !time || !hoursOfWork || !location || !salary) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const job = new Job({
      title, date, time,
      hoursOfWork: Number(hoursOfWork),
      location, salary,
      contactPhone: contactPhone || '',
      contactEmail: contactEmail || '',
      postedBy: req.user.id,
      employerName: req.user.name
    });
    await job.save();
    res.status(201).json({ ...job.toObject(), applicantCount: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/jobs/:id/applicants
router.get('/:id/applicants', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const applicants = await Application.find({ jobId: req.params.id }).sort({ appliedAt: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
