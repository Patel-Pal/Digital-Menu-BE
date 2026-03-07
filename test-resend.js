/**
 * Quick Resend Test Script
 */

require('dotenv').config();
const fetch = require('node-fetch');

async function testResend() {
  console.log('\n🧪 Testing Resend Configuration...\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'noreply@digitalmenu.com';
  const testEmail = process.argv[2] || 'patelkenil0029@gmail.com';
  
  console.log('📧 Email Provider:', process.env.EMAIL_PROVIDER);
  console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('📨 From:', emailFrom);
  console.log('📬 To:', testEmail);
  console.log('');
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in .env file');
    process.exit(1);
  }
  
  if (!apiKey.startsWith('re_')) {
    console.error('❌ Invalid RESEND_API_KEY format (should start with "re_")');
    process.exit(1);
  }
  
  console.log('📤 Sending test email via Resend...\n');
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [testEmail],
        subject: 'Test Email from Digital Menu',
        html: `
          <h1>✅ Resend is Working!</h1>
          <p>Your Resend configuration is correct.</p>
          <p>Test OTP: <strong>123456</strong></p>
          <p>This is a test email from Digital Menu backend.</p>
        `
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Resend API Error:');
      console.error('Status:', response.status);
      console.error('Message:', data.message || data.error);
      console.error('Details:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', data.id);
    console.log('');
    console.log('✨ Check your inbox:', testEmail);
    console.log('');
    console.log('🎉 Resend is configured correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testResend();
