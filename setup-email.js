#!/usr/bin/env node

/**
 * Interactive Email Service Setup Script
 * Helps configure email service for Digital Menu application
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function main() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║        Digital Menu - Email Service Setup Wizard          ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('This wizard will help you configure email service for OTP delivery.\n', 'blue');

  // Step 1: Choose provider
  log('Step 1: Choose Email Provider\n', 'bold');
  log('1. Resend (Recommended - Modern, easy setup)', 'green');
  log('   Free: 3,000 emails/month | Paid: $20/50k emails');
  log('   Setup time: 2 minutes\n');
  
  log('2. Brevo (Sendinblue - High volume)', 'green');
  log('   Free: 9,000 emails/month | Paid: $25/20k emails');
  log('   Setup time: 5 minutes\n');
  
  log('3. Gmail (Quick test only)', 'yellow');
  log('   Free: 500 emails/day | Not recommended for production');
  log('   Setup time: 5 minutes\n');
  
  log('4. Mailtrap (Testing only - emails don\'t actually send)', 'yellow');
  log('   Perfect for development/testing');
  log('   Setup time: 2 minutes\n');

  const choice = await question('Enter your choice (1-4): ');

  let config = {
    EMAIL_PROVIDER: '',
    EMAIL_FROM: '',
    FRONTEND_URL: 'http://localhost:5173'
  };

  switch (choice.trim()) {
    case '1':
      await setupResend(config);
      break;
    case '2':
      await setupBrevo(config);
      break;
    case '3':
      await setupGmail(config);
      break;
    case '4':
      await setupMailtrap(config);
      break;
    default:
      log('\n✗ Invalid choice. Exiting.', 'red');
      rl.close();
      return;
  }

  // Step 2: Update .env file
  log('\n\nStep 2: Updating .env file...', 'bold');
  await updateEnvFile(config);

  // Step 3: Test configuration
  log('\n\nStep 3: Testing email service...', 'bold');
  const testEmail = await question('\nEnter your email to receive a test OTP: ');
  
  log('\nSending test email...', 'cyan');
  
  try {
    const { execSync } = require('child_process');
    execSync(`node test-email-service.js ${testEmail}`, { stdio: 'inherit' });
    
    log('\n✓ Setup complete!', 'green');
    log('\nNext steps:', 'bold');
    log('1. Check your email for the test OTP', 'blue');
    log('2. Start the server: npm run dev', 'blue');
    log('3. Test forgot password: http://localhost:5173/auth/forgot-password', 'blue');
    
  } catch (error) {
    log('\n✗ Test failed. Please check your configuration.', 'red');
    log('Review EMAIL_SERVICE_SETUP.md for troubleshooting.', 'yellow');
  }

  rl.close();
}

async function setupResend(config) {
  log('\n\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Resend Setup                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('1. Go to https://resend.com and sign up', 'blue');
  log('2. Navigate to API Keys section', 'blue');
  log('3. Click "Create API Key"', 'blue');
  log('4. Copy the key (starts with "re_")\n', 'blue');

  config.EMAIL_PROVIDER = 'resend';
  config.RESEND_API_KEY = await question('Enter your Resend API key: ');
  config.EMAIL_FROM = await question('Enter sender email (e.g., noreply@yourdomain.com): ');

  log('\n✓ Resend configuration saved', 'green');
}

async function setupBrevo(config) {
  log('\n\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Brevo Setup                             ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('1. Go to https://www.brevo.com and sign up', 'blue');
  log('2. Navigate to SMTP & API → API Keys', 'blue');
  log('3. Click "Generate a new API key"', 'blue');
  log('4. Copy the key\n', 'blue');

  config.EMAIL_PROVIDER = 'brevo';
  config.BREVO_API_KEY = await question('Enter your Brevo API key: ');
  config.EMAIL_FROM = await question('Enter sender email (e.g., noreply@yourdomain.com): ');

  log('\n✓ Brevo configuration saved', 'green');
}

async function setupGmail(config) {
  log('\n\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Gmail Setup                             ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('⚠️  Gmail is not recommended for production use!', 'yellow');
  log('    Use Resend or Brevo for production.\n', 'yellow');

  log('1. Enable 2FA: https://myaccount.google.com/security', 'blue');
  log('2. Generate App Password: https://myaccount.google.com/apppasswords', 'blue');
  log('3. Select "Mail" and "Windows Computer"', 'blue');
  log('4. Copy the 16-character password\n', 'blue');

  config.EMAIL_PROVIDER = 'nodemailer';
  config.EMAIL_HOST = 'smtp.gmail.com';
  config.EMAIL_PORT = '587';
  config.EMAIL_SECURE = 'false';
  config.EMAIL_USER = await question('Enter your Gmail address: ');
  config.EMAIL_PASSWORD = await question('Enter your App Password (16 chars): ');
  config.EMAIL_FROM = config.EMAIL_USER;

  log('\n✓ Gmail configuration saved', 'green');
}

async function setupMailtrap(config) {
  log('\n\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                  Mailtrap Setup                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('ℹ️  Mailtrap is for testing only - emails won\'t actually send!', 'yellow');
  log('   All emails will appear in your Mailtrap inbox.\n', 'yellow');

  log('1. Go to https://mailtrap.io and sign up', 'blue');
  log('2. Create an inbox', 'blue');
  log('3. Go to SMTP Settings', 'blue');
  log('4. Copy the credentials\n', 'blue');

  config.EMAIL_PROVIDER = 'nodemailer';
  config.EMAIL_HOST = 'smtp.mailtrap.io';
  config.EMAIL_PORT = '2525';
  config.EMAIL_SECURE = 'false';
  config.EMAIL_USER = await question('Enter Mailtrap username: ');
  config.EMAIL_PASSWORD = await question('Enter Mailtrap password: ');
  config.EMAIL_FROM = 'noreply@digitalmenu.com';

  log('\n✓ Mailtrap configuration saved', 'green');
}

async function updateEnvFile(config) {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Read existing .env or create from example
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  }

  // Update or add email configuration
  const lines = envContent.split('\n');
  const configKeys = Object.keys(config);
  
  configKeys.forEach(key => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${config[key]}`;
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  });

  // Write updated .env file
  fs.writeFileSync(envPath, envContent);
  log('✓ .env file updated successfully', 'green');
}

// Run the wizard
main().catch(error => {
  log(`\n✗ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
