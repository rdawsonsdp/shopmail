# Shopify Pickup Email System

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Shopify API Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# Firebase/Firestore Configuration
# Option 1: Service account JSON file path (for local development)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Option 2: Service account JSON as string (for Vercel/production)
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Cron Security (optional but recommended)
CRON_SECRET=your_random_secret_string
```

## Getting Shopify API Credentials

1. Go to your Shopify Admin panel
2. Navigate to Apps > Develop apps
3. Create a new app or use an existing one
4. Enable the following scopes:
   - `read_orders`
   - `read_customers`
5. Install the app and copy the Admin API access token

## Email Setup

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as `SMTP_PASSWORD`

### Other SMTP Providers
Update the SMTP configuration variables according to your provider's settings.

## Database Setup

This application uses **Google Cloud Firestore** as its database, which works perfectly on Vercel!

See [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) for detailed setup instructions.

Quick setup:
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Add the path or JSON string to your `.env.local` file

### Deployment Steps

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. If using SQLite, consider adding a database service or updating to Postgres
5. Deploy

The cron job is configured to run hourly. You can adjust the schedule in `vercel.json`.

## Cron Job Configuration

The cron job runs at the path `/api/cron`. To secure it:

1. Set `CRON_SECRET` environment variable
2. Configure Vercel cron with Authorization header:
   ```
   Authorization: Bearer your_random_secret_string
   ```

Or update the cron configuration in Vercel dashboard to include the Authorization header.

## Usage

### Viewing Sent Emails
Visit the home page to see all sent emails with their status.

### Configuring Email Templates
1. Navigate to `/templates`
2. Edit existing templates or create new ones
3. Use template variables:
   - `{{customer_name}}` - Customer's full name
   - `{{order_number}}` - Order number (e.g., #1001)
   - `{{order_id}}` - Shopify order ID

### Running the Cron Job Manually
You can test the cron job by visiting `/api/cron` in your browser or using curl:

```bash
curl -X GET http://localhost:3000/api/cron \
  -H "Authorization: Bearer your_cron_secret"
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- ✅ Automatic email sending via cron job
- ✅ Web interface to view sent emails
- ✅ Email template configuration
- ✅ Template variables support
- ✅ Email status tracking
- ✅ Prevents duplicate emails
- ✅ Error handling and logging

