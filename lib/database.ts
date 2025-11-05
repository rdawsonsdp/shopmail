// Re-export Firestore database functions
export * from './database-firestore';

// Re-export types (Firestore uses string IDs, but we'll keep compatibility)
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

