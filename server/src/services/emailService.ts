import nodemailer from 'nodemailer';
import APIError from '../errors/APIError';

export const sendRegistrationEmail = async (email: string, completeLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Autohub - Confirm Registration',
      text: `Visit this link to complete registration: ${completeLink}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new APIError('Failed to send registration email', 500);
  }
};
