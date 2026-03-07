/**
 * Email Service Configuration
 * Supports multiple email providers: Resend, Brevo (Sendinblue), Nodemailer
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.provider = process.env.EMAIL_PROVIDER || 'nodemailer'; // 'resend', 'brevo', 'nodemailer'
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'resend':
        // Resend will be used via API
        this.resendApiKey = process.env.RESEND_API_KEY;
        break;
      
      case 'brevo':
        // Brevo (Sendinblue) will be used via API
        this.brevoApiKey = process.env.BREVO_API_KEY;
        break;
      
      case 'nodemailer':
      default:
        // Nodemailer with SMTP
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
        break;
    }
  }

  /**
   * Send email using configured provider
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @param {string} options.from - Sender email (optional)
   */
  async sendEmail({ to, subject, text, html, from }) {
    const fromEmail = from || process.env.EMAIL_FROM || 'noreply@digitalmenu.com';

    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendWithResend({ to, subject, text, html, from: fromEmail });
        
        case 'brevo':
          return await this.sendWithBrevo({ to, subject, text, html, from: fromEmail });
        
        case 'nodemailer':
        default:
          return await this.sendWithNodemailer({ to, subject, text, html, from: fromEmail });
      }
    } catch (error) {
      console.error(`Email sending failed with ${this.provider}:`, error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }

  /**
   * Send email using Resend API
   */
  async sendWithResend({ to, subject, text, html, from }) {
    const fetch = require('node-fetch');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: subject,
        text: text,
        html: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Resend API error');
    }

    console.log('Email sent successfully via Resend:', data.id);
    return { success: true, messageId: data.id, provider: 'resend' };
  }

  /**
   * Send email using Brevo (Sendinblue) API
   */
  async sendWithBrevo({ to, subject, text, html, from }) {
    const fetch = require('node-fetch');

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.brevoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: from, name: 'Digital Menu' },
        to: [{ email: to }],
        subject: subject,
        textContent: text,
        htmlContent: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Brevo API error');
    }

    console.log('Email sent successfully via Brevo:', data.messageId);
    return { success: true, messageId: data.messageId, provider: 'brevo' };
  }

  /**
   * Send email using Nodemailer (SMTP)
   */
  async sendWithNodemailer({ to, subject, text, html, from }) {
    try {
      const mailOptions = {
        from: `"Digital Menu" <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully via Nodemailer:', info.messageId);
      return { success: true, messageId: info.messageId, provider: 'nodemailer' };
    } catch (error) {
      console.error('Nodemailer error:', error.message);
      
      // Provide helpful error messages
      if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
        throw new Error('SMTP connection timeout. Gmail SMTP may not work on cloud platforms like Render. Consider switching to Resend or Brevo.');
      } else if (error.code === 'EAUTH') {
        throw new Error('SMTP authentication failed. Check EMAIL_USER and EMAIL_PASSWORD.');
      } else if (error.code === 'ECONNECTION') {
        throw new Error('Cannot connect to SMTP server. Check EMAIL_HOST and EMAIL_PORT.');
      }
      
      throw error;
    }
  }

  /**
   * Verify email service connection
   */
  async verify() {
    try {
      switch (this.provider) {
        case 'resend':
          if (!this.resendApiKey) {
            throw new Error('RESEND_API_KEY not configured');
          }
          console.log('✓ Resend API key configured');
          return true;
        
        case 'brevo':
          if (!this.brevoApiKey) {
            throw new Error('BREVO_API_KEY not configured');
          }
          console.log('✓ Brevo API key configured');
          return true;
        
        case 'nodemailer':
        default:
          await this.transporter.verify();
          console.log('✓ Nodemailer SMTP connection verified');
          return true;
      }
    } catch (error) {
      console.error('✗ Email service verification failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
const emailService = new EmailService();

module.exports = emailService;
