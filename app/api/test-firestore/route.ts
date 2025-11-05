import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Try to initialize database (will create default template if needed)
    await initializeDatabase();
    
    // Try to get templates to verify connection
    const { getEmailTemplates } = await import('@/lib/database');
    const templates = await getEmailTemplates();
    
    return NextResponse.json({
      success: true,
      message: 'Firestore connection successful!',
      templatesCount: templates.length,
      firestoreConfigured: true,
    });
  } catch (error) {
    console.error('Firestore connection test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isConfigError = errorMessage.includes('service account') || 
                         errorMessage.includes('credential') ||
                         errorMessage.includes('ENOENT') ||
                         errorMessage.includes('Cannot find module');
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        firestoreConfigured: false,
        needsSetup: isConfigError,
        instructions: isConfigError ? {
          step1: 'Download Firebase service account JSON from Google Cloud Console',
          step2: 'Save it as firebase-service-account.json in project root',
          step3: 'Make sure Firestore is enabled in Firebase Console',
          links: {
            serviceAccounts: 'https://console.cloud.google.com/iam-admin/serviceaccounts?project=shopmail-1e0a5',
            firestore: 'https://console.firebase.google.com/project/shopmail-1e0a5/firestore',
          }
        } : undefined,
      },
      { status: 500 }
    );
  }
}



