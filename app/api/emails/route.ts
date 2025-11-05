import { NextRequest, NextResponse } from 'next/server';
import { getSentEmails } from '@/lib/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const { emails, total } = await getSentEmails(limit, offset);

    return NextResponse.json({
      emails: emails || [],
      total: total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    return NextResponse.json(
      { 
        emails: [],
        total: 0,
        limit,
        offset,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

