# Gmail Email Setup Guide

## Setting Up Gmail SMTP for Email Sending

Your email account `brownsugarshopify@gmail.com` needs to be configured to send emails. Gmail requires an **App Password** instead of your regular password.

## Step-by-Step Instructions

### 1. Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2-factor authentication

### 2. Generate an App Password
1. Go to App Passwords: https://myaccount.google.com/apppasswords
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. Select app: Choose **Mail**
3. Select device: Choose **Other (Custom name)** and type "Shopify Email System"
4. Click **Generate**
5. Copy the 16-character password (no spaces)

### 3. Update Your .env.local File

Update your `.env.local` file with the App Password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=brownsugarshopify@gmail.com
SMTP_PASSWORD=your_16_character_app_password_here
EMAIL_FROM=brownsugarshopify@gmail.com
```

**Important:** Replace `your_16_character_app_password_here` with the actual App Password you generated.

### 4. Test the Email Connection

You can test your email setup in two ways:

#### Option A: Using the Test Endpoint (Recommended)
1. Make sure your dev server is running: `npm run dev`
2. Send a POST request to `/api/test-email`:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-test-email@gmail.com"}'
```

#### Option B: Test via Browser Console
Open your browser console on any page and run:

```javascript
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'your-test-email@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

### 5. Troubleshooting

#### Error: "Invalid login credentials"
- Make sure you're using the App Password, not your regular Gmail password
- Verify the App Password has no spaces
- Check that 2-factor authentication is enabled

#### Error: "Less secure app access"
- This shouldn't happen with App Passwords, but if it does:
  - Make sure you're using an App Password (not regular password)
  - Check that 2FA is enabled

#### Error: "Connection timeout"
- Check your internet connection
- Verify SMTP settings:
  - Host: `smtp.gmail.com`
  - Port: `587`
  - Secure: `false`

### 6. Verify Email Configuration

Check your current email settings:

```bash
# View email-related env vars (without showing password)
cat .env.local | grep -E "SMTP|EMAIL"
```

### Next Steps

Once email is working:
1. Create an email template in `/templates`
2. Set it as active
3. Test the full flow by running the cron job: `/api/cron`

## Quick Reference

- **SMTP Host:** smtp.gmail.com
- **SMTP Port:** 587
- **SMTP Secure:** false (TLS)
- **Username:** brownsugarshopify@gmail.com
- **Password:** Your 16-character App Password
- **From Email:** brownsugarshopify@gmail.com



