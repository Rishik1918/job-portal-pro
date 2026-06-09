import express from 'express';
import {
  getJobs, getJobById, createJob, updateJob, deleteJob,
  applyJob, getJobApplications, saveJobToggle, getRecruiterStats, getCandidateApplications
} from '../controllers/jobController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import { validateJobPayload } from '../middleware/validationMiddleware.js';
import { uploadLogo, uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/stats', verifyToken, checkRole('Recruiter'), getRecruiterStats);
router.get('/candidate/applications', verifyToken, checkRole('Candidate'), getCandidateApplications);
router.get('/:id', getJobById);

router.post('/', verifyToken, checkRole('Recruiter'), uploadLogo.single('logo'), validateJobPayload, createJob);
router.put('/:id', verifyToken, checkRole('Recruiter'), uploadLogo.single('logo'), validateJobPayload, updateJob);
router.delete('/:id', verifyToken, checkRole('Recruiter'), deleteJob);

router.post('/:id/apply', verifyToken, checkRole('Candidate'), uploadResume.single('resume'), applyJob);
router.get('/:id/applications', verifyToken, checkRole('Recruiter'), getJobApplications);
router.post('/:id/save', verifyToken, checkRole('Candidate'), saveJobToggle);

export default router;
