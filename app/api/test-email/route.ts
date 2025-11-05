import { NextRequest, NextResponse } from 'next/server';
import { getEmailTransporter } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json();
    
    if (!to) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const transporter = getEmailTransporter();
    
    // Verify connection
    await transporter.verify();
    
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'brownsugarshopify@gmail.com',
      to: to,
      subject: 'Test Email from Brown Sugar Bakery',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your Brown Sugar Bakery email system.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
      `,
      text: 'This is a test email from your Brown Sugar Bakery email system. If you receive this, your email configuration is working correctly!',
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}



