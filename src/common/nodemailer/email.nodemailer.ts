import * as nodemailer from 'nodemailer';
require('dotenv').config();

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 2525,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },

    tls: {
        rejectUnauthorized: false // Accept self-signed certificates (for debugging)
    }

});