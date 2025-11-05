import nodemailer from 'nodemailer';

export interface EmailConfig {
  from: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    password: string;
  };
}

export function getEmailTransporter() {
  const emailConfig: EmailConfig = {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
    },
  };

  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const transporter = getEmailTransporter();
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}



