// Email Templates for Excellence Coaching Hub
// Modern, responsive, and branded email designs

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const headerStyle = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
`

const contentStyle = `
  padding: 40px 30px;
  color: #333;
`

const buttonStyle = `
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  margin: 20px 0;
  transition: transform 0.2s;
`

const footerStyle = `
  background: #f8f9fa;
  padding: 20px 30px;
  text-align: center;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
`

const successBadgeStyle = `
  display: inline-block;
  background: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  margin: 20px 0;
`

const infoBadgeStyle = `
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  color: #333;
`

/**
 * Verification Email Template
 * Sent when a new user registers
 */
export const verificationEmailTemplate = (name, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          ${baseStyles}
        }
        .container {
          ${containerStyle}
        }
        .header {
          ${headerStyle}
        }
        .content {
          ${contentStyle}
        }
        .button {
          ${buttonStyle}
        }
        .footer {
          ${footerStyle}
        }
        .welcome-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          color: #667eea;
          margin-top: 0;
        }
        .highlight {
          color: #667eea;
          font-weight: 600;
        }
        .info-box {
          ${infoBadgeStyle}
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="welcome-icon">🎉</div>
          <p class="title">Welcome to Excellence Coaching Hub!</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name}! 👋</h2>
          
          <p>Thank you for joining us! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">
              ✓ Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #667eea; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${verificationLink}
          </p>
          
          <div class="info-box">
            <strong>⏱️ Time Sensitive:</strong> This verification link expires in <strong>24 hours</strong> for security reasons. If you don't verify within this time, you'll need to register again.
          </div>
          
          <p style="margin-top: 30px; color: #666;">
            If you didn't create this account, please ignore this email or contact our support team.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2024 Excellence Coaching Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Contract Approved Email Template
 * Sent when an admin approves a contract
 */
export const contractApprovedTemplate = (name, portalLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          ${baseStyles}
        }
        .container {
          ${containerStyle}
        }
        .header {
          ${headerStyle}
        }
        .content {
          ${contentStyle}
        }
        .button {
          ${buttonStyle}
        }
        .footer {
          ${footerStyle}
        }
        .success-badge {
          ${successBadgeStyle}
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          color: #10b981;
          margin-top: 0;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .features {
          background: #f0fdf4;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin: 10px 0;
          color: #333;
        }
        .feature-icon {
          color: #10b981;
          font-weight: bold;
          margin-right: 10px;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <div class="icon">✅</div>
          <p class="title">Contract Approved!</p>
        </div>
        
        <div class="content">
          <h2>Great News, ${name}!</h2>
          
          <p style="font-size: 16px; color: #333;">
            Your employment contract has been <strong>successfully approved</strong> by our HR team. Congratulations! 🎊
          </p>
          
          <div class="success-badge">
            Status: Approved ✓
          </div>
          
          <h3 style="color: #333; margin-top: 30px;">What's Next?</h3>
          
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">📄</span>
              <span><strong>Download Your Contract:</strong> Access your signed contract from the portal</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📋</span>
              <span><strong>Review Details:</strong> Check all employment terms and conditions</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💼</span>
              <span><strong>Keep It Safe:</strong> Save a copy for your records</span>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${portalLink}" class="button" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">
              📥 Download Contract
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you have any questions or need assistance, don't hesitate to contact our HR support team.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2024 Excellence Coaching Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Contract Rejected Email Template
 * Sent when an admin rejects a contract
 */
export const contractRejectedTemplate = (name, reason, portalLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          ${baseStyles}
        }
        .container {
          ${containerStyle}
        }
        .header {
          ${headerStyle}
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .content {
          ${contentStyle}
        }
        .button {
          ${buttonStyle}
        }
        .footer {
          ${footerStyle}
        }
        .warning-badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          margin: 20px 0;
          border: 1px solid #fcd34d;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          color: #d97706;
          margin-top: 0;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .reason-box {
          background: #fff7ed;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          color: #333;
        }
        .next-steps {
          background: #fef3c7;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          margin: 12px 0;
          color: #333;
        }
        .step-number {
          background: #d97706;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-weight: bold;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">⚠️</div>
          <p class="title">Contract Requires Updates</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name},</h2>
          
          <p style="font-size: 16px; color: #333;">
            Your employment contract has been <strong>reviewed</strong> and requires some updates before final approval.
          </p>
          
          <div class="warning-badge">
            Status: Pending Revision
          </div>
          
          <h3 style="color: #333; margin-top: 30px;">Reason for Revision:</h3>
          
          <div class="reason-box">
            <p style="margin: 0; color: #333; font-size: 15px;">
              <strong>📝 Feedback:</strong><br>
              ${reason || 'Please review the contract and make necessary updates as discussed.'}
            </p>
          </div>
          
          <h3 style="color: #333; margin-top: 30px;">What You Need to Do:</h3>
          
          <div class="next-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div>
                <strong>Review the Feedback:</strong> Read the reason above carefully to understand what needs to be changed.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div>
                <strong>Update Your Contract:</strong> Make the necessary modifications to your employment contract.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div>
                <strong>Resubmit:</strong> Upload the updated contract to the portal for another review.
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${portalLink}" class="button" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">
              📤 Update Contract
            </a>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-top: 20px; color: #666; font-size: 14px;">
            <strong>💡 Tip:</strong> If you're unsure about any of the required changes, please don't hesitate to reach out to our HR team for clarification.
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2024 Excellence Coaching Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Contract Under Review Email Template
 * Sent when a contract is submitted for review (optional)
 */
export const contractUnderReviewTemplate = (name, contractRef, estimatedTime) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          ${baseStyles}
        }
        .container {
          ${containerStyle}
        }
        .header {
          ${headerStyle}
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        .content {
          ${contentStyle}
        }
        .button {
          ${buttonStyle}
        }
        .footer {
          ${footerStyle}
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          color: #3b82f6;
          margin-top: 0;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .info-card {
          background: #eff6ff;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #bfdbfe;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          color: #2563eb;
          font-weight: bold;
        }
        .timeline {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #3b82f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">📋</div>
          <p class="title">Contract Received</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name}!</h2>
          
          <p style="font-size: 16px; color: #333;">
            Thank you for submitting your employment contract. We've received it and it's now under review by our HR team.
          </p>
          
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">Reference Number</div>
              <div class="info-value">#${contractRef}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Estimated Review Time</div>
              <div class="info-value">${estimatedTime || '2-3 Days'}</div>
            </div>
          </div>
          
          <div class="timeline">
            <h3 style="margin-top: 0; color: #2563eb;">📅 Timeline</h3>
            <p style="margin: 10px 0; color: #333;">
              <strong>1-2 Days:</strong> Initial review and verification<br>
              <strong>2-3 Days:</strong> Detailed assessment and feedback<br>
              <strong>By Day 3-4:</strong> You'll receive our decision via email
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            You'll receive an update soon. In the meantime, if you need to make any changes or have questions, please update your submission through the portal.
          </p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-top: 20px; color: #666; font-size: 14px;">
            <strong>📧 Notification:</strong> We'll send you an email as soon as the review is complete.
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2024 Excellence Coaching Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Welcome Email Template (Optional - sent after email verification)
 */
export const welcomeEmailTemplate = (name, dashboardLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          ${baseStyles}
        }
        .container {
          ${containerStyle}
        }
        .header {
          ${headerStyle}
        }
        .content {
          ${contentStyle}
        }
        .button {
          ${buttonStyle}
        }
        .footer {
          ${footerStyle}
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          color: #667eea;
          margin-top: 0;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .feature {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #e9ecef;
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .feature-name {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">👋</div>
          <p class="title">Welcome Aboard!</p>
        </div>
        
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          
          <p style="font-size: 16px; color: #333;">
            Your email has been verified successfully. You're now ready to get started with Excellence Coaching Hub!
          </p>
          
          <h3 style="color: #333; margin-top: 30px;">Here's What You Can Do:</h3>
          
          <div class="features-grid">
            <div class="feature">
              <div class="feature-icon">📄</div>
              <div class="feature-name">Submit Contracts</div>
            </div>
            <div class="feature">
              <div class="feature-icon">👤</div>
              <div class="feature-name">Manage Profile</div>
            </div>
            <div class="feature">
              <div class="feature-icon">📊</div>
              <div class="feature-name">Track Status</div>
            </div>
            <div class="feature">
              <div class="feature-icon">💬</div>
              <div class="feature-name">Support Access</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${dashboardLink}" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">
              🚀 Go to Dashboard
            </a>
          </div>
          
          <div style="background: #f0f4ff; padding: 15px; border-radius: 4px; margin-top: 20px; border-left: 4px solid #667eea;">
            <strong style="color: #667eea;">🎯 Getting Started:</strong>
            <p style="margin: 10px 0 0 0; color: #333; font-size: 14px;">
              Start by uploading your employment contract in the dashboard. Our HR team will review it and get back to you with feedback.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2024 Excellence Coaching Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}