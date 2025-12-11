# Email Setup for Contact Form

The contact form currently logs submissions to the console. To actually send emails to `spotnuru@wisc.edu`, you'll need to set up an email service.

## Option 1: Use Nodemailer with Gmail (Recommended for Development)

1. Install nodemailer:
```bash
cd server
npm install nodemailer
```

2. Create a Gmail App Password:
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Copy the 16-character password

3. Add to `server/.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=spotnuru@wisc.edu
```

4. Update `server/server.js` to use nodemailer (see commented code in the `/contact/send` endpoint)

## Option 2: Use SendGrid (Recommended for Production)

1. Sign up for SendGrid (free tier available)
2. Get your API key
3. Install: `npm install @sendgrid/mail`
4. Add to `server/.env`:
```
SENDGRID_API_KEY=your-api-key
EMAIL_TO=spotnuru@wisc.edu
```

## Option 3: Use UW-Madison Email Service

If you have access to UW-Madison's email infrastructure, configure SMTP settings in `server/.env` and use nodemailer.

## Current Implementation

Right now, the contact form:
- Validates input on the frontend
- Sends data to `/contact/send` endpoint
- Backend logs the submission to console
- Returns success to the user

To enable actual email sending, uncomment and configure the email service code in `server/server.js`.

