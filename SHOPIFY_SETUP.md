# How to Connect to Shopify and Get Orders

## Step-by-Step Guide

### Step 1: Create a Shopify App

1. **Log in to your Shopify Admin**
   - Go to: https://your-shop.myshopify.com/admin
   - Replace `your-shop` with your actual shop name

2. **Navigate to Apps**
   - In the left sidebar, click **"Apps"**
   - Scroll down and click **"Develop apps"** (or "App and sales channel settings" > "Develop apps")

3. **Create a New App**
   - Click **"Create an app"**
   - Enter a name: `Pickup Email System` (or any name you prefer)
   - Enter your email address
   - Click **"Create app"**

### Step 2: Configure API Scopes

1. **Click on your newly created app**

2. **Go to "Configuration" tab**

3. **Under "Admin API integration scopes"**, enable:
   - ✅ `read_orders` - To read order information
   - ✅ `read_customers` - To read customer information

4. **Click "Save"**

### Step 3: Install the App

1. **Go to "API credentials" tab**

2. **Click "Install app"** (or "Install" button)
   - This will install the app to your store and generate the access token

3. **After installation, you'll see:**
   - **API Key** (Client ID)
   - **API Secret Key** (Client Secret)
   - **Admin API access token** (this is what you need!)

### Step 4: Get Your Shop Domain

Your shop domain is: `your-shop.myshopify.com`
- Replace `your-shop` with your actual shop name
- Example: `brown-sugar-bakery.myshopify.com`

### Step 5: Add Credentials to `.env.local`

Open your `.env.local` file and add:

```env
# Shopify API Configuration
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
```

**Example:**
```env
SHOPIFY_API_KEY=abc123def456ghi789
SHOPIFY_API_SECRET=xyz789uvw456rst123
SHOPIFY_ACCESS_TOKEN=shpat_abcd1234efgh5678ijkl9012
SHOPIFY_SHOP_DOMAIN=brown-sugar-bakery.myshopify.com
```

### Step 6: Test the Connection

You can test the connection by:

1. **Restart your dev server** (if it's running)
2. **Visit the cron endpoint** (or create a test endpoint):
   ```bash
   curl http://localhost:3000/api/cron
   ```

## What Orders Are Fetched?

The current code fetches orders that:
- Have `fulfillment_status: 'fulfilled'` (orders that are fulfilled)
- Have `financial_status: 'paid'` (orders that are paid)
- Have an email address

You can customize this in `lib/shopify.ts` in the `getShopifyOrders()` function.

## Troubleshooting

### Error: "SHOPIFY_ACCESS_TOKEN is not configured"
- Make sure you've added `SHOPIFY_ACCESS_TOKEN` to your `.env.local` file
- Restart your dev server after adding environment variables

### Error: "Unauthorized" or "403 Forbidden"
- Check that your API scopes are correct (`read_orders` and `read_customers`)
- Verify your access token is correct
- Make sure the app is installed on your store

### Error: "Invalid shop domain"
- Check that `SHOPIFY_SHOP_DOMAIN` is in the format: `your-shop.myshopify.com`
- Don't include `https://` or trailing slashes

### Testing Orders Locally

If you want to test without real orders, you can:
1. Create a test order in your Shopify store
2. Mark it as fulfilled
3. Make sure it has a customer email
4. The cron job will pick it up

## Quick Reference

**Where to find credentials:**
- Shopify Admin → Apps → Develop apps → Your App → API credentials

**Required Scopes:**
- `read_orders`
- `read_customers`

**Environment Variables Needed:**
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_SHOP_DOMAIN`

## Next Steps

Once connected, the cron job (`/api/cron`) will:
1. Fetch fulfilled orders from Shopify
2. Check if emails have already been sent (using Firestore)
3. Send pickup notification emails to customers
4. Log all sent emails to the database

You can view sent emails at: `http://localhost:3000/`



