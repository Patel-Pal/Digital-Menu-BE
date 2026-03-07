const nodemailer = require('nodemailer');
require('dotenv').config();

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

async function testSMTP() {
  console.log('\n' + '='.repeat(60));
  console.log('  SMTP CONNECTION TEST');
  console.log('='.repeat(60) + '\n');

  // Display configuration (hide password)
  log.info('Configuration:');
  console.log(`  Host: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`  Port: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  console.log(`  Secure: ${process.env.EMAIL_SECURE || 'false'}`);
  console.log(`  User: ${process.env.EMAIL_USER || 'NOT SET'}`);
  
  if (process.env.EMAIL_PASSWORD) {
    const pass = process.env.EMAIL_PASSWORD;
    console.log(`  Password: ${'*'.repeat(Math.min(pass.length - 4, 12))}${pass.slice(-4)}`);
  } else {
    console.log(`  Password: NOT SET`);
  }
  console.log('');

  // Check if all required variables are set
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    log.error('Missing required environment variables!');
    console.log('\nPlease set the following in your .env file:');
    console.log('  EMAIL_HOST=smtp.gmail.com');
    console.log('  EMAIL_PORT=587');
    console.log('  EMAIL_SECURE=false');
    console.log('  EMAIL_USER=your-email@gmail.com');
    console.log('  EMAIL_PASSWORD=your-app-password');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Test connection
  log.step('Testing SMTP connection...');
  
  try {
    await transporter.verify();
    log.success('SMTP connection successful!');
    log.info('Server is ready to send emails.');
    
    console.log('\n' + '-'.repeat(60) + '\n');
    
    // Ask if user wants to send test email
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Send a test email? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        log.step('Sending test email...');
        
        try {
          const info = await transporter.sendMail({
            from: `"Digital Menu Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: '✅ Test Email from Digital Menu Backend',
            text: 'Congratulations! Your email configuration is working correctly.',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4CAF50;">✅ Email Configuration Successful!</h2>
                <p>Congratulations! Your Digital Menu Backend email system is working correctly.</p>
                <p>You can now use the forgot password feature.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                  This is a test email from your Digital Menu Backend application.
                </p>
              </div>
            `
          });
          
          log.success('Test email sent successfully!');
          log.info(`Message ID: ${info.messageId}`);
          log.info(`Check your inbox: ${process.env.EMAIL_USER}`);
          
          console.log('\n' + '='.repeat(60));
          log.success('ALL TESTS PASSED!');
          console.log('='.repeat(60) + '\n');
        } catch (error) {
          log.error('Failed to send test email!');
          console.error('Error:', error.message);
        }
      } else {
        log.info('Test email skipped.');
      }
      
      readline.close();
    });
    
  } catch (error) {
    log.error('SMTP connection failed!');
    console.error('\nError Details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}`);
    
    console.log('\n' + '-'.repeat(60));
    log.warning('TROUBLESHOOTING TIPS:');
    console.log('');
    
    if (error.code === 'EAUTH') {
      log.error('Authentication Failed!');
      console.log('\n🔧 Solutions:');
      console.log('  1. Use Gmail App Password (not regular password)');
      console.log('  2. Enable 2-Step Verification first:');
      console.log('     https://myaccount.google.com/security');
      console.log('  3. Generate App Password:');
      console.log('     https://myaccount.google.com/apppasswords');
      console.log('  4. Remove ALL spaces from App Password');
      console.log('  5. Use your actual Gmail address for EMAIL_USER');
      console.log('\n📖 See EMAIL_SETUP_GUIDE.md for detailed instructions');
      
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      log.error('Connection Failed!');
      console.log('\n🔧 Solutions:');
      console.log('  1. Check your internet connection');
      console.log('  2. Verify firewall settings');
      console.log('  3. Try port 465 with EMAIL_SECURE=true');
      console.log('  4. Check if port 587 is blocked');
      
    } else if (error.code === 'ESOCKET') {
      log.error('Socket Error!');
      console.log('\n🔧 Solutions:');
      console.log('  1. Check network connectivity');
      console.log('  2. Verify SMTP server address');
      console.log('  3. Try different port (465 or 587)');
      
    } else {
      log.error('Unknown Error!');
      console.log('\n🔧 Solutions:');
      console.log('  1. Check all environment variables');
      console.log('  2. Verify SMTP credentials');
      console.log('  3. Try alternative email service (Mailtrap)');
      console.log('  4. See EMAIL_SETUP_GUIDE.md for help');
    }
    
    console.log('\n' + '-'.repeat(60));
    log.info('Alternative: Use Mailtrap for testing');
    console.log('  1. Sign up: https://mailtrap.io/');
    console.log('  2. Get SMTP credentials');
    console.log('  3. Update .env with Mailtrap settings');
    console.log('  4. No Gmail setup needed!');
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

testSMTP().catch(error => {
  log.error(`Test failed: ${error.message}`);
  process.exit(1);
});
