import { google } from 'googleapis';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    'postmessage'
    );