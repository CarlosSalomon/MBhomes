import dotenv from 'dotenv';
import program from '../process.js';
import  {config, v2} from "cloudinary"

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" 
    ? ".env.production" 
    : ".env.development"
});


export default {
 mongo_url : process.env.MONGODB_URL,
 SECRET : process.env.SECRET_KEY,
 EMAIL : process.env.EMAIL,
 CLIENTID : process.env.CLIENT_ID,
 CLIENTSECRET : process.env.CLIENT_SECRET,
 CALLBACK : process.env.CALLBACK_URL,
 PORT : process.env.PORT,
 gmailAccount: process.env.GMAIL_ACCOUNT,
 gmailAppPassword: process.env.GMAIL_APP_PASSWD,
 SERVICE : process.env.SERVICE,
 BASE_URL : process.env.BASE_URL,
 STRIPE_APP_SECRET_KEY: process.env.STRIPE_APP_SECRET_KEY,
 environment : environment,
}

const cloudinaryConfig = (req, res, next) => {
    config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    next();
};

export {cloudinaryConfig, v2}