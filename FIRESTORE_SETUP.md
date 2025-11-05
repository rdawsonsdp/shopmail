# Firebase/Firestore Setup Guide

This application uses Google Cloud Firestore as its database. Follow these steps to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "Shopify Pickup Emails")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (or test mode for development)
4. Select a location for your database (choose closest to your users)
5. Click **Enable**

## Step 3: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project from the dropdown
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in:
   - Service account name: `shopify-pickup-emails`
   - Click **Create and Continue**
   - Grant role: `Cloud Datastore User` (or `Firestore User`)
   - Click **Continue** then **Done**
6. Click on the newly created service account
7. Go to the **Keys** tab
8. Click **Add Key** > **Create new key**
9. Choose **JSON** format
10. Download the JSON file - **SAVE THIS SECURELY!**

## Step 4: Configure Environment Variables

You have two options for authentication:

### Option A: Service Account File (Local Development)

1. Place the downloaded JSON file in your project root (e.g., `firebase-service-account.json`)
2. Add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   ```
3. **Important**: Add `firebase-service-account.json` to `.gitignore`!

### Option B: Service Account JSON String (Vercel/Production)

1. Open the downloaded JSON file
2. Copy the entire JSON content as a single line
3. Add to `.env.local` or Vercel environment variables:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
   ```

### Option C: Application Default Credentials (Google Cloud)

If deploying to Google Cloud Run or App Engine, you can use Application Default Credentials:
- No additional configuration needed if running on Google Cloud infrastructure

## Step 5: Update .gitignore

Make sure your `.gitignore` includes:
```
firebase-service-account.json
*.json
!package.json
!package-lock.json
!tsconfig.json
```

## Step 6: Initialize Collections

The application will automatically create the following collections when first used:
- `sent_emails` - Stores all sent email records
- `email_templates` - Stores email templates

A default template will be created automatically on first run.

## Step 7: Set Up Firestore Indexes (if needed)

If you see errors about missing indexes, Firestore will provide a link to create them. Click the link and create the required indexes.

## Security Rules (Optional)

For production, set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sent_emails/{emailId} {
      allow read, write: if request.auth != null; // Only authenticated users
    }
    match /email_templates/{templateId} {
      allow read, write: if request.auth != null; // Only authenticated users
    }
  }
}
```

Note: These rules require Firebase Authentication. For server-only access (current setup), you can allow all reads/writes but restrict access through your API routes.

## Testing the Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3001/templates`
3. You should see the default template created automatically
4. Try creating a new template to verify Firestore is working

## Troubleshooting

### Error: "Firebase Admin SDK initialization failed"
- Check that your service account JSON is valid
- Verify the environment variable is set correctly
- Ensure the service account has proper permissions

### Error: "Missing or insufficient permissions"
- Check that your service account has `Cloud Datastore User` or `Firestore User` role
- Verify you're using the correct Firebase project

### Error: "Collection does not exist"
- This is normal - collections are created automatically on first write
- Try accessing the templates page to trigger creation

## Vercel Deployment

For Vercel deployment:
1. Add `FIREBASE_SERVICE_ACCOUNT_KEY` as an environment variable in Vercel dashboard
2. Paste the entire JSON as a single-line string
3. Deploy - Firestore will work seamlessly!



