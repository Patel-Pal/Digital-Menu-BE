/**
 * Test Script for Forgot Password Functionality
 * 
 * This script tests the complete password reset flow:
 * 1. Request OTP
 * 2. Verify OTP
 * 3. Reset Password
 * 4. Login with new password
 * 
 * Usage: node test-forgot-password.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test@example.com'; // Change to your test email

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

// Test data
let testOtp = '';
const newPassword = 'testpass123';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testForgotPassword() {
  try {
    log.step('Step 1: Requesting OTP for password reset...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email: TEST_EMAIL
    });

    if (response.data.success) {
      log.success('OTP request successful!');
      log.info(`Response: ${response.data.message}`);
      log.warning('Please check your email for the OTP and enter it below.');
      return true;
    } else {
      log.error('OTP request failed');
      return false;
    }
  } catch (error) {
    log.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testVerifyOtp(otp) {
  try {
    log.step('Step 2: Verifying OTP...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email: TEST_EMAIL,
      otp: otp
    });

    if (response.data.success) {
      log.success('OTP verified successfully!');
      return true;
    } else {
      log.error('OTP verification failed');
      return false;
    }
  } catch (error) {
    log.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testResetPassword(otp) {
  try {
    log.step('Step 3: Resetting password...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      email: TEST_EMAIL,
      otp: otp,
      newPassword: newPassword,
      confirmPassword: newPassword
    });

    if (response.data.success) {
      log.success('Password reset successful!');
      log.info(`Response: ${response.data.message}`);
      return true;
    } else {
      log.error('Password reset failed');
      return false;
    }
  } catch (error) {
    log.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogin() {
  try {
    log.step('Step 4: Testing login with new password...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: newPassword
    });

    if (response.data.success) {
      log.success('Login successful with new password!');
      log.info(`User: ${response.data.user.name} (${response.data.user.role})`);
      return true;
    } else {
      log.error('Login failed');
      return false;
    }
  } catch (error) {
    log.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testInvalidOtp() {
  try {
    log.step('Testing invalid OTP...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email: TEST_EMAIL,
      otp: '000000'
    });

    log.error('Invalid OTP was accepted (this should not happen!)');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Invalid OTP correctly rejected');
      return true;
    }
    log.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

async function testPasswordMismatch(otp) {
  try {
    log.step('Testing password mismatch...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      email: TEST_EMAIL,
      otp: otp,
      newPassword: 'password1',
      confirmPassword: 'password2'
    });

    log.error('Password mismatch was accepted (this should not happen!)');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Password mismatch correctly rejected');
      return true;
    }
    log.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  FORGOT PASSWORD FUNCTIONALITY TEST');
  console.log('='.repeat(60) + '\n');

  log.info(`Testing with email: ${TEST_EMAIL}`);
  log.warning('Make sure the backend server is running on http://localhost:5000\n');

  // Test 1: Request OTP
  const otpRequested = await testForgotPassword();
  if (!otpRequested) {
    log.error('Test failed at OTP request step');
    return;
  }

  console.log('\n' + '-'.repeat(60));
  
  // Wait for user to enter OTP
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('\nEnter the OTP from your email: ', async (otp) => {
    testOtp = otp.trim();
    readline.close();

    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 2: Verify OTP
    const otpVerified = await testVerifyOtp(testOtp);
    if (!otpVerified) {
      log.error('Test failed at OTP verification step');
      return;
    }

    await sleep(1000);
    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 3: Reset Password
    const passwordReset = await testResetPassword(testOtp);
    if (!passwordReset) {
      log.error('Test failed at password reset step');
      return;
    }

    await sleep(1000);
    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 4: Login with new password
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      log.error('Test failed at login step');
      return;
    }

    await sleep(1000);
    console.log('\n' + '-'.repeat(60) + '\n');

    // Additional Tests
    log.info('Running additional security tests...\n');
    
    await testInvalidOtp();
    await sleep(500);
    
    // Request new OTP for password mismatch test
    await testForgotPassword();
    log.warning('Check your email for a new OTP for the next test...');
    
    readline2 = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline2.question('\nEnter the new OTP: ', async (otp2) => {
      const newOtp = otp2.trim();
      readline2.close();
      
      await sleep(500);
      await testPasswordMismatch(newOtp);

      console.log('\n' + '='.repeat(60));
      log.success('ALL TESTS COMPLETED!');
      console.log('='.repeat(60) + '\n');
    });
  });
}

// Run tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
