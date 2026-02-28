/**
 * Email Service Test Script
 * Tests the email service configuration and sends a test OTP email
 * 
 * Usage: node test-email-service.js <email@example.com>
 */

require('dotenv').config();
const emailService = require('./config/emailService');
const { otpEmailTemplate } = require('./utils/emailTemplates');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`)
};

async function testEmailService() {
  console.log('\n' + '='.repeat(60));
  console.log('  EMAIL SERVICE TEST');
  console.log('='.repeat(60) + '\n');

  // Get test email from command line or use default
  const testEmail = process.argv[2] || 'test@example.com';
  
  log.info(`Email Provider: ${process.env.EMAIL_PROVIDER || 'nodemailer'}`);
  log.info(`Test Email: ${testEmail}`);
  log.info(`From Email: ${process.env.EMAIL_FROM || 'noreply@digitalmenu.com'}\n`);

  // Step 1: Verify Configuration
  log.step('Step 1: Verifying email service configuration...');
  
  try {
    const isValid = await emailService.verify();
    if (isValid) {
      log.success('Email service configuration is valid');
    } else {
      log.error('Email service configuration is invalid');
      process.exit(1);
    }
  } catch (error) {
    log.error(`Configuration error: ${error.message}`);
    log.warning('\nPlease check your .env file and ensure:');
    
    if (process.env.EMAIL_PROVIDER === 'resend') {
      console.log('  - RESEND_API_KEY is set');
      console.log('  - API key starts with "re_"');
    } else if (process.env.EMAIL_PROVIDER === 'brevo') {
      console.log('  - BREVO_API_KEY is set');
    } else {
      console.log('  - EMAIL_HOST is set');
      console.log('  - EMAIL_PORT is set');
      console.log('  - EMAIL_USER is set');
      console.log('  - EMAIL_PASSWORD is set');
    }
    
    process.exit(1);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // Step 2: Generate Test OTP
  log.step('Step 2: Generating test OTP...');
  
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
  log.success(`Generated OTP: ${testOtp}`);

  console.log('\n' + '-'.repeat(60) + '\n');

  // Step 3: Generate Email Content
  log.step('Step 3: Generating email content from template...');
  
  const emailContent = otpEmailTemplate(testOtp, 'Test User');
  log.success('Email template generated');
  log.info(`Subject: ${emailContent.subject}`);

  console.log('\n' + '-'.repeat(60) + '\n');

  // Step 4: Send Test Email
  log.step('Step 4: Sending test email...');
  
  try {
    const result = await emailService.sendEmail({
      to: testEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    });

    log.success('Email sent successfully!');
    log.info(`Provider: ${result.provider}`);
    log.info(`Message ID: ${result.messageId}`);
    
    console.log('\n' + '='.repeat(60));
    log.success('ALL TESTS PASSED!');
    console.log('='.repeat(60) + '\n');
    
    log.warning('Please check your email inbox (and spam folder) for the test OTP email.');
    
    if (process.env.EMAIL_PROVIDER === 'nodemailer' && process.env.EMAIL_HOST === 'smtp.mailtrap.io') {
      log.info('\nUsing Mailtrap: Check your Mailtrap inbox at https://mailtrap.io');
    }
    
  } catch (error) {
    log.error(`Failed to send email: ${error.message}`);
    
    console.log('\n' + '-'.repeat(60));
    log.warning('Troubleshooting Tips:');
    console.log('\n1. Check your email provider credentials');
    console.log('2. Verify API key is valid and not expired');
    console.log('3. Check if email service is down');
    console.log('4. Review EMAIL_SERVICE_SETUP.md for detailed setup');
    console.log('5. Try a different email provider\n');
    
    process.exit(1);
  }
}

// Run the test
testEmailService().catch(error => {
  log.error(`Test failed: ${error.message}`);
  process.exit(1);
});
