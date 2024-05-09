import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
  SMTP: {
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
};
