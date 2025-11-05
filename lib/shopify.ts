import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-01';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ['read_orders', 'read_customers'],
  hostName: process.env.SHOPIFY_SHOP_DOMAIN || '',
  apiVersion: ApiVersion.January24,
  isEmbeddedApp: false,
  restResources,
});

export interface ShopifyOrder {
  id: string;
  name: string;
  email: string;
  fulfillment_status: string;
  financial_status: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  line_items?: Array<{
    title: string;
    quantity: number;
  }>;
}

export async function getShopifyOrders(): Promise<ShopifyOrder[]> {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
  }

  const session = shopify.session.customAppSession(process.env.SHOPIFY_SHOP_DOMAIN || '');
  session.accessToken = accessToken;

  const client = new shopify.clients.Rest({ session });

  try {
    // Fetch orders that are fulfilled and paid, ready for pickup
    const response = await client.get({
      path: 'orders',
      query: {
        status: 'any',
        fulfillment_status: 'fulfilled',
        financial_status: 'paid',
        limit: 250,
      },
    });

    const orders = response.body.orders as ShopifyOrder[];
    
    // Filter orders that might need pickup emails
    // You can customize this logic based on your needs
    return orders.filter(order => {
      // Add your custom logic here, e.g., check tags, metafields, etc.
      return order.email && order.fulfillment_status === 'fulfilled';
    });
  } catch (error) {
    console.error('Error fetching Shopify orders:', error);
    throw error;
  }
}

export async function getShopifyOrder(orderId: string): Promise<ShopifyOrder | null> {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
  }

  const session = shopify.session.customAppSession(process.env.SHOPIFY_SHOP_DOMAIN || '');
  session.accessToken = accessToken;

  const client = new shopify.clients.Rest({ session });

  try {
    const response = await client.get({
      path: `orders/${orderId}`,
    });

    return response.body.order as ShopifyOrder;
  } catch (error) {
    console.error(`Error fetching Shopify order ${orderId}:`, error);
    return null;
  }
}



