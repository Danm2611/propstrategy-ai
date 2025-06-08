import { Resend } from 'resend'

// Initialize Resend (will be undefined if API key not set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  if (!resend) {
    console.warn('Resend not configured - email not sent:', options.subject)
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'PropStrategy AI <noreply@propertyagent.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Send report completion notification
 */
export async function sendReportCompletionEmail(
  userEmail: string,
  userName: string | null,
  reportId: string,
  propertyAddress: string,
  reportUrl: string
) {
  const subject = 'Your Property Analysis Report is Ready!'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">PropStrategy AI</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Property Analysis is Complete</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hello ${userName || 'there'}!</h2>
        
        <p>Great news! Your property analysis report for <strong>${propertyAddress}</strong> has been completed and is now ready for download.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #667eea;">What's in your report?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Comprehensive property analysis</li>
            <li>Market insights and trends</li>
            <li>Development opportunities</li>
            <li>Financial projections</li>
            <li>Risk assessment</li>
            <li>Implementation recommendations</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/reports/${reportId}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            View Your Report
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you have any questions about your report, please don't hesitate to contact our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          PropStrategy AI - AI-Powered Property Investment Analysis<br>
          This email was sent to ${userEmail}
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
    Hello ${userName || 'there'}!

    Your property analysis report for ${propertyAddress} has been completed and is now ready for download.

    View your report: ${process.env.NEXTAUTH_URL}/dashboard/reports/${reportId}

    Your report includes:
    - Comprehensive property analysis
    - Market insights and trends  
    - Development opportunities
    - Financial projections
    - Risk assessment
    - Implementation recommendations

    If you have any questions about your report, please contact our support team.

    PropStrategy AI
  `

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text
  })
}

/**
 * Send report failure notification
 */
export async function sendReportFailureEmail(
  userEmail: string,
  userName: string | null,
  reportId: string,
  propertyAddress: string,
  errorMessage: string
) {
  const subject = 'Issue with Your Property Analysis Report'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">PropStrategy AI</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Report Processing Issue</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hello ${userName || 'there'},</h2>
        
        <p>We encountered an issue while processing your property analysis report for <strong>${propertyAddress}</strong>.</p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin-top: 0; color: #856404;">What happened?</h3>
          <p style="margin: 0; color: #856404;">${errorMessage}</p>
        </div>
        
        <p><strong>Good news:</strong> Your credit has been automatically refunded to your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/analyze" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Try Again
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If you continue to experience issues, please contact our support team and we'll help resolve this quickly.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          PropStrategy AI - AI-Powered Property Investment Analysis<br>
          This email was sent to ${userEmail}
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
    Hello ${userName || 'there'},

    We encountered an issue while processing your property analysis report for ${propertyAddress}.

    Error: ${errorMessage}

    Your credit has been automatically refunded to your account.

    You can try submitting your analysis again: ${process.env.NEXTAUTH_URL}/analyze

    If you continue to experience issues, please contact our support team.

    PropStrategy AI
  `

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text
  })
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string | null
) {
  const subject = 'Welcome to PropStrategy AI!'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to PropStrategy AI!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">AI-Powered Property Investment Analysis</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hello ${userName || 'there'}!</h2>
        
        <p>Welcome to PropStrategy AI! We're excited to help you make smarter property investment decisions with our AI-powered analysis platform.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">Getting Started</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li>Purchase credits or choose a subscription plan</li>
            <li>Submit your first property for analysis</li>
            <li>Receive comprehensive investment insights</li>
            <li>Make informed investment decisions</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
            Go to Dashboard
          </a>
          <a href="${process.env.NEXTAUTH_URL}/analyze" 
             style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Start Analysis
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If you have any questions, our support team is here to help. Just reply to this email!
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          PropStrategy AI - AI-Powered Property Investment Analysis<br>
          This email was sent to ${userEmail}
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
    Welcome to PropStrategy AI!

    Hello ${userName || 'there'}!

    We're excited to help you make smarter property investment decisions with our AI-powered analysis platform.

    Getting Started:
    1. Purchase credits or choose a subscription plan
    2. Submit your first property for analysis  
    3. Receive comprehensive investment insights
    4. Make informed investment decisions

    Get started: ${process.env.NEXTAUTH_URL}/dashboard

    If you have any questions, just reply to this email!

    PropStrategy AI
  `

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text
  })
}