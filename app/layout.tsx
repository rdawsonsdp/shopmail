import './globals.css';

export const metadata = {
  title: 'Shopify Pickup Emails',
  description: 'Manage pickup email notifications for Shopify orders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



