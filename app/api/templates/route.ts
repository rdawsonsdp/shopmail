import { NextRequest, NextResponse } from 'next/server';
import { getEmailTemplates, createEmailTemplate } from '@/lib/database';

export async function GET() {
  try {
    const templates = await getEmailTemplates();

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { 
        templates: [],
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, body_html, body_text, is_active } = body;

    if (!name || !subject || !body_html || !body_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = await createEmailTemplate({
      name,
      subject,
      body_html,
      body_text,
      is_active: is_active ?? true,
    });

    return NextResponse.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

