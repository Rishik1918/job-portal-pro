import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  jsonTransport: true
});

export const sendApplicationEmail = async (recruiterEmail, applicantName, jobTitle) => {
  try {
    const info = await transporter.sendMail({
      from: '"JobPortalPro Platform" <noreply@jobportalpro.com>',
      to: recruiterEmail,
      subject: `New Application Received: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>New Application Notification</h2>
          <p>Hello,</p>
          <p>A candidate has applied to your job listing: <strong>${jobTitle}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Applicant Name:</strong> ${applicantName}</p>
          <p>You can review this application details on your <a href="http://localhost:5173/recruiter-dashboard">Recruiter Dashboard</a>.</p>
          <p>Best regards,<br/>JobPortalPro Team</p>
        </div>
      `
    });
    console.log(`[EMAIL SENT] Notification to ${recruiterEmail} via jsonTransport`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email: ${error.message}`);
  }
};
