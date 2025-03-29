import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRegistrationEmail = async (email: string, completeLink: string) => {
  return;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Autohub - Confirm Registration',
    text: `Visit this link to complete registration: ${completeLink}`,
  };

  await transporter.sendMail(mailOptions);
};
