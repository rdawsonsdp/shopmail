import {
  getActiveEmailTemplate,
  getSentEmailByOrderId,
  createSentEmail,
  type EmailTemplate,
} from '@/lib/database';
import { getShopifyOrders, type ShopifyOrder } from '@/lib/shopify';
import { sendEmail, replaceTemplateVariables } from '@/lib/email';

export async function processPickupEmails(): Promise<{
  processed: number;
  sent: number;
  errors: number;
  details: Array<{ orderId: string; status: string; error?: string }>;
}> {
  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: [] as Array<{ orderId: string; status: string; error?: string }>,
  };

  try {
    // Get active email template
    const template = await getActiveEmailTemplate();

    if (!template) {
      throw new Error('No active email template found');
    }

    // Get orders from Shopify
    const orders = await getShopifyOrders();

    for (const order of orders) {
      results.processed++;
      
      try {
        // Check if email already sent for this order
        const existingEmail = await getSentEmailByOrderId(order.id);

        if (existingEmail) {
          results.details.push({
            orderId: order.id,
            status: 'skipped',
            error: 'Email already sent',
          });
          continue;
        }

        // Get customer email and name
        const customerEmail = order.email || order.customer?.email;
        const customerName = order.customer
          ? `${order.customer.first_name} ${order.customer.last_name}`.trim()
          : 'Customer';

        if (!customerEmail) {
          results.errors++;
          results.details.push({
            orderId: order.id,
            status: 'error',
            error: 'No customer email found',
          });
          continue;
        }

        // Replace template variables
        const variables = {
          customer_name: customerName,
          order_number: order.name,
          order_id: order.id,
        };

        const subject = replaceTemplateVariables(template.subject, variables);
        const html = replaceTemplateVariables(template.body_html, variables);
        const text = replaceTemplateVariables(template.body_text, variables);

        // Send email
        await sendEmail({
          to: customerEmail,
          subject,
          html,
          text,
        });

        // Record sent email
        await createSentEmail({
          order_id: order.id,
          order_number: order.name,
          customer_email: customerEmail,
          customer_name: customerName,
          subject,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

        results.sent++;
        results.details.push({
          orderId: order.id,
          status: 'sent',
        });
      } catch (error) {
        results.errors++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Record failed email
        await createSentEmail({
          order_id: order.id,
          order_number: order.name,
          customer_email: order.email || '',
          customer_name: order.customer
            ? `${order.customer.first_name} ${order.customer.last_name}`.trim()
            : 'Customer',
          subject: template.subject,
          status: 'failed',
          error_message: errorMessage,
          sent_at: new Date().toISOString(),
        });

        results.details.push({
          orderId: order.id,
          status: 'error',
          error: errorMessage,
        });
      }
    }
  } catch (error) {
    console.error('Error processing pickup emails:', error);
    throw error;
  }

  return results;
}

