import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { sendApplicationEmail } from '../utils/emailHelper.js';

export const getJobs = async (req, res) => {
  try {
    const { search, location, type, minSalary, maxSalary, sort, page = 1, limit = 6, postedBy } = req.query;
    let query = {};

    // Recruiter filter mapping
    if (postedBy === 'me' && req.user) {
      query.postedBy = req.user._id;
    }

    // Dynamic Context Engine Filtering
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    // Sort evaluation pipeline execution mapping logic
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'salary_low') sortOptions = { salary: 1 };
    if (sort === 'salary_high') sortOptions = { salary: -1 };

    // Dynamic analytical aggregation counters
    const skip = (Number(page) - 1) * Number(limit);
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('postedBy', 'name email');

    res.json({
      success: true,
      count: totalJobs,
      pages: Math.ceil(totalJobs / Number(limit)),
      currentPage: Number(page),
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job details matching target missing' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, description } = req.body;
    const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : '';
    const job = await Job.create({
      title, company, location, type, salary: Number(salary), description,
      logoUrl,
      postedBy: req.user._id
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized job update request' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.logoUrl = `/uploads/logos/${req.file.filename}`;
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job target not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized job delete request' });
    }

    await job.deleteOne();
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Application details missing name, email or phone' });
    }

    // Phone format regex rule check
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian phone number' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your resume in PDF format' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const application = await Application.create({
      jobId: req.params.id,
      applicantId: req.user._id,
      name, email, phone,
      resumeUrl
    });

    // Send email to recruiter
    const targetJob = await Job.findById(req.params.id).populate('postedBy', 'email');
    if (targetJob && targetJob.postedBy && targetJob.postedBy.email) {
      sendApplicationEmail(targetJob.postedBy.email, name, targetJob.title);
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized applications query execution' });
    }

    const applications = await Application.find({ jobId: req.params.id });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveJobToggle = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    if (user.savedJobs.includes(jobId)) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.json({ success: true, message: 'Job bookmark deleted successfully', saved: false });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      return res.json({ success: true, message: 'Job added to bookmarks collection tracking data references', saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterStats = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = myJobs.map(j => j._id);
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    // Aggregate applications to find the most applied job
    let mostAppliedJob = 'N/A';
    if (jobIds.length > 0) {
      const topApplied = await Application.aggregate([
        { $match: { jobId: { $in: jobIds } } },
        { $group: { _id: '$jobId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      if (topApplied.length > 0) {
        const jobInfo = await Job.findById(topApplied[0]._id);
        if (jobInfo) {
          mostAppliedJob = `${jobInfo.title} (${topApplied[0].count})`;
        }
      }
    }

    res.json({
      success: true,
      stats: {
        jobsPosted: myJobs.length,
        applicationsReceived: totalApplications,
        mostAppliedJob
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id }).populate('jobId');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
