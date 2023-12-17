
import { ConfigService } from '@nestjs/config';
import {config} from 'dotenv'

config()
export const db= {
    url: process.env.DATABASE_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_KEY: process.env.TOKEN_KEY,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY
    }




    

  