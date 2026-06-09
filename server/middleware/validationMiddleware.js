export const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All registration parameters are mandatory' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Malformed email syntax' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Security thresholds mandate min 6 character password length' });
  }
  next();
};

export const validateJobPayload = (req, res, next) => {
  const { title, company, location, type, salary, description } = req.body;
  if (!title || !company || !location || !type || !salary || !description) {
    return res.status(400).json({ success: false, message: 'All job metrics are mandatory parameters' });
  }
  if (isNaN(salary) || Number(salary) <= 0) {
    return res.status(400).json({ success: false, message: 'Financial salary value arguments must be positive integers' });
  }
  next();
};
