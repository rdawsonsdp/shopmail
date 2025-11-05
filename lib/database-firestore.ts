import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Option 1: Use service account JSON (for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    // Option 2: Use service account file path (for local development)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      try {
        // Use dynamic import to avoid build-time errors
        const fs = require('fs');
        const path = require('path');
        const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } else {
          // Fallback to application default credentials
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
          });
        }
      } catch (fileError) {
        // Fallback to application default credentials
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }
    // Option 3: Use application default credentials (for Vercel/Google Cloud)
    else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    // During build time, Firebase might not be available - that's okay
    // It will be initialized at runtime when environment variables are set
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
      console.error('Error initializing Firebase Admin:', error);
    }
    // Don't try fallback during build - let it fail gracefully
    // Firebase will be initialized at runtime when needed
  }
}

function getDb() {
  if (!admin.apps.length) {
    // If not initialized, try to initialize with application default credentials
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (error) {
      // Silently fail - will be initialized at runtime
    }
  }
  return admin.firestore();
}

export const db = getDb();

// Collection names
const COLLECTIONS = {
  SENT_EMAILS: 'sent_emails',
  EMAIL_TEMPLATES: 'email_templates',
};

export interface SentEmail {
  id: string;
  order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  sent_at: string;
  subject: string;
  status: string;
  error_message?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Database operations for sent emails
export async function getSentEmails(limit: number = 50, offset: number = 0): Promise<{
  emails: SentEmail[];
  total: number;
}> {
  try {
    const sentEmailsRef = db.collection(COLLECTIONS.SENT_EMAILS);
    
    // Get total count (handle errors gracefully)
    let total = 0;
    try {
      const totalSnapshot = await sentEmailsRef.count().get();
      total = totalSnapshot.data().count;
    } catch (error) {
      // If count fails, we'll count manually
      console.warn('Count query failed, counting manually:', error);
    }

    try {
      // Try with orderBy first (requires index)
      const snapshot = await sentEmailsRef
        .orderBy('sent_at', 'desc')
        .limit(limit + offset)
        .get();

      const allEmails = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as SentEmail[];

      // Apply offset manually
      const emails = allEmails.slice(offset);
      
      // If count failed, use actual count
      if (total === 0) {
        total = allEmails.length;
      }

      return { emails, total };
    } catch (error) {
      // If orderBy fails (no index), fetch without ordering
      console.warn('OrderBy query failed, fetching without order:', error);
      try {
        const snapshot = await sentEmailsRef
          .limit(limit + offset)
          .get();

        const allEmails = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as SentEmail[];

        // Sort manually by sent_at (descending)
        allEmails.sort((a, b) => {
          const aTime = new Date(a.sent_at || 0).getTime();
          const bTime = new Date(b.sent_at || 0).getTime();
          return bTime - aTime;
        });

        const emails = allEmails.slice(offset);
        
        if (total === 0) {
          total = allEmails.length;
        }

        return { emails, total };
      } catch (innerError) {
        // If even basic query fails, return empty array
        console.error('Firestore query failed completely:', innerError);
        return { emails: [], total: 0 };
      }
    }
  } catch (error) {
    // Ultimate fallback - return empty array
    console.error('Error in getSentEmails:', error);
    return { emails: [], total: 0 };
  }
}

export async function getSentEmailByOrderId(orderId: string): Promise<SentEmail | null> {
  const snapshot = await db.collection(COLLECTIONS.SENT_EMAILS)
    .where('order_id', '==', orderId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as SentEmail;
}

export async function createSentEmail(data: Omit<SentEmail, 'id'>): Promise<string> {
  const docRef = await db.collection(COLLECTIONS.SENT_EMAILS).add({
    ...data,
    sent_at: data.sent_at || new Date().toISOString(),
  });
  return docRef.id;
}

// Database operations for email templates
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    try {
      // Try with orderBy first (requires index)
      const snapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES)
        .orderBy('created_at', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        is_active: doc.data().is_active ?? true,
      })) as EmailTemplate[];
    } catch (error) {
      // If orderBy fails (no index), fetch without ordering and sort manually
      console.warn('OrderBy query failed, fetching without order:', error);
      try {
        const snapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).get();

        const templates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          is_active: doc.data().is_active ?? true,
        })) as EmailTemplate[];

        // Sort manually by created_at (descending)
        templates.sort((a, b) => {
          const aTime = new Date(a.created_at || 0).getTime();
          const bTime = new Date(b.created_at || 0).getTime();
          return bTime - aTime;
        });

        return templates;
      } catch (innerError) {
        // If even basic query fails, return empty array
        console.error('Firestore query failed completely:', innerError);
        return [];
      }
    }
  } catch (error) {
    // Ultimate fallback - return empty array
    console.error('Error in getEmailTemplates:', error);
    return [];
  }
}

export async function getActiveEmailTemplate(): Promise<EmailTemplate | null> {
  try {
    const snapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES)
      .where('is_active', '==', true)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        is_active: doc.data().is_active ?? true,
      } as EmailTemplate;
    }
  } catch (error) {
    console.warn('Query with where clause failed, trying alternative:', error);
  }

  // Fallback: get all templates and find active one
  try {
    const allTemplates = await getEmailTemplates();
    const activeTemplate = allTemplates.find(t => t.is_active);
    
    if (activeTemplate) {
      return activeTemplate;
    }

    // If no templates exist, create default
    if (allTemplates.length === 0) {
      await createDefaultTemplate();
      // Try again after creating default
      const retryTemplates = await getEmailTemplates();
      return retryTemplates.find(t => t.is_active) || null;
    }
  } catch (error) {
    console.error('Error getting active template:', error);
  }

  return null;
}

export async function getEmailTemplate(id: string): Promise<EmailTemplate | null> {
  const doc = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).doc(id).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
    is_active: doc.data()?.is_active ?? true,
  } as EmailTemplate;
}

export async function createEmailTemplate(data: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).add({
    ...data,
    is_active: data.is_active ?? true,
    created_at: now,
    updated_at: now,
  });
  return docRef.id;
}

export async function updateEmailTemplate(id: string, data: Partial<EmailTemplate>): Promise<void> {
  await db.collection(COLLECTIONS.EMAIL_TEMPLATES).doc(id).update({
    ...data,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteEmailTemplate(id: string): Promise<void> {
  await db.collection(COLLECTIONS.EMAIL_TEMPLATES).doc(id).delete();
}

async function createDefaultTemplate(): Promise<void> {
  const defaultTemplate = {
    name: 'Pickup Notification',
    subject: 'Your Brown Sugar Bakery order is ready for pickup! 🍰',
    body_html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8f9fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #e8924a 0%, #d67a2a 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; font-family: 'Dancing Script', cursive;">
                        Brown Sugar Bakery
                      </h1>
                      <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; font-weight: 500; letter-spacing: 1px;">
                        MADE IN CHICAGO, IL
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #60301e; font-size: 24px; font-weight: bold;">
                        Hello {{customer_name}}! 👋
                      </h2>
                      
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Great news! Your order is ready for pickup at our bakery.
                      </p>
                      
                      <!-- Order Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <tr>
                          <td>
                            <h3 style="margin: 0 0 15px 0; color: #60301e; font-size: 18px; font-weight: bold;">
                              📦 Order Details
                            </h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                                  <strong style="color: #60301e;">Order Number:</strong>
                                </td>
                                <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                                  <strong>{{order_number}}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px; padding: 8px 0;">
                                  <strong style="color: #60301e;">Order ID:</strong>
                                </td>
                                <td style="color: #333333; font-size: 14px; padding: 8px 0; text-align: right; font-family: monospace;">
                                  {{order_id}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Please visit us during our business hours to collect your order:
                      </p>
                      
                      <!-- Store Hours -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8f0; border-left: 4px solid #e8924a; border-radius: 4px; padding: 15px 20px; margin: 20px 0;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 8px 0; color: #60301e; font-size: 14px; font-weight: bold;">
                              🏪 Store Hours
                            </p>
                            <p style="margin: 4px 0; color: #666666; font-size: 14px;">
                              <strong>Monday:</strong> Closed<br>
                              <strong>Tuesday - Saturday:</strong> 10:00 AM - 6:00 PM<br>
                              <strong>Sunday:</strong> 12:00 PM - 5:00 PM
                            </p>
                            <p style="margin: 12px 0 0 0; color: #666666; font-size: 14px;">
                              <strong>📍 Location:</strong><br>
                              328 E 75th Street<br>
                              Chicago, IL 60619<br>
                              <strong>Phone:</strong> (773) 224-6262
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        We look forward to seeing you soon!
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Thank you for choosing Brown Sugar Bakery! 🍰
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px;">
                        Brown Sugar Bakery<br>
                        328 E 75th Street, Chicago, IL 60619
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 11px;">
                        © ${new Date().getFullYear()} Brown Sugar Bakery. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    body_text: `
Hello {{customer_name}}!

Great news! Your order is ready for pickup at Brown Sugar Bakery.

ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: {{order_number}}
Order ID: {{order_id}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please visit us during our business hours to collect your order:

STORE HOURS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monday: Closed
Tuesday - Saturday: 10:00 AM - 6:00 PM
Sunday: 12:00 PM - 5:00 PM

LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
328 E 75th Street
Chicago, IL 60619
Phone: (773) 224-6262

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We look forward to seeing you soon!

Thank you for choosing Brown Sugar Bakery!

Brown Sugar Bakery
328 E 75th Street, Chicago, IL 60619
© ${new Date().getFullYear()} Brown Sugar Bakery. All rights reserved.
    `.trim(),
    is_active: true,
  };

  await createEmailTemplate(defaultTemplate);
}

// Initialize default template if needed
export async function initializeDatabase(): Promise<void> {
  const templates = await getEmailTemplates();
  if (templates.length === 0) {
    await createDefaultTemplate();
  }
}

