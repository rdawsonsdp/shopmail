# How to Get Firebase Service Account Credentials

## Your Firebase Project
- **Project ID**: `shopmail-1e0a5`
- **Project Name**: shopmail-1e0a5

## Steps to Get Service Account Credentials

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/iam-admin/serviceaccounts?project=shopmail-1e0a5
2. Or navigate manually:
   - Go to https://console.cloud.google.com/
   - Select project: **shopmail-1e0a5**

### Step 2: Create Service Account (if you don't have one)
1. Click **"+ CREATE SERVICE ACCOUNT"**
2. Service account name: `shopify-pickup-emails-admin`
3. Click **"CREATE AND CONTINUE"**
4. Grant role: **"Cloud Datastore User"** or **"Firestore User"**
5. Click **"CONTINUE"** then **"DONE"**

### Step 3: Create and Download Key
1. Click on the service account you just created (or existing one)
2. Go to the **"KEYS"** tab
3. Click **"ADD KEY"** > **"Create new key"**
4. Choose **JSON** format
5. Click **"CREATE"**
6. The JSON file will download automatically

### Step 4: Save the Key File
1. Move the downloaded JSON file to your project root: `/Users/robertdawson/Shopify/`
2. Rename it to: `firebase-service-account.json`
3. The `.env.local` file is already configured to use this path

### Step 5: Verify Firestore is Enabled
1. Go to: https://console.firebase.google.com/project/shopmail-1e0a5/firestore
2. If you see "Get started" or "Create database", click it
3. Choose **Start in production mode** (or test mode for development)
4. Select a location (e.g., `us-central`)
5. Click **"Enable"**

### Step 6: Test the Connection
Once you've saved the `firebase-service-account.json` file:
1. Restart your dev server if it's running
2. Visit: http://localhost:3001/templates
3. The default template should be created automatically in Firestore

## Alternative: Use JSON String (for Vercel)

If you prefer to use the JSON as an environment variable string:

1. Open the downloaded JSON file
2. Copy the entire content as a single line
3. Replace `FIREBASE_SERVICE_ACCOUNT_PATH` with `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local`
4. Paste the JSON string (remove all line breaks)

Example:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"shopmail-1e0a5","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

## Quick Links
- **Firebase Console**: https://console.firebase.google.com/project/shopmail-1e0a5
- **Firestore Database**: https://console.firebase.google.com/project/shopmail-1e0a5/firestore
- **Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=shopmail-1e0a5
- **IAM & Admin**: https://console.cloud.google.com/iam-admin/iam?project=shopmail-1e0a5



