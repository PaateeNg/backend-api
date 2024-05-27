import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
  SMTP: {
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },

  PERCENTAGE: {
    VENDOR: process.env.VENDORPERCENTAGE,
    PlANNER: process.env.PLANNERPERCENTAGE,
  },
  PAYSTACK: {
    PAYSTACK_SECRET: process.env.PAYSTACK_SECRET,
    PAYSTACK_URL: process.env.PAYSTACK_URL,
  },

  PAYMENT_STATUS: {
    NOT_PAID: process.env.PAYMENT_NOT_PAID_STATUS,
    PAID: process.env.PAYMENT_PAID_STATUS,
  },

  GOOGLE_OUGHT: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALL_BACK_URL: process.env.CALL_BACK_URL,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },
};
