const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-menu')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');

async function testOtpVerification() {
  try {
    // Get the email you're testing with
    const testEmail = process.argv[2] || 'test@example.com';
    const testOtp = process.argv[3] || '123456';
    
    console.log(`\nTesting OTP verification for: ${testEmail}`);
    console.log(`OTP to verify: ${testOtp}`);
    
    // Find user
    const user = await User.findOne({ email: testEmail.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('\n📋 User Details:');
    console.log(`- Email: ${user.email}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Stored OTP: ${user.resetOtp}`);
    console.log(`- OTP Expiry: ${user.resetOtpExpire}`);
    console.log(`- Current Time: ${new Date()}`);
    
    // Check if OTP matches
    if (user.resetOtp !== testOtp) {
      console.log(`\n❌ OTP Mismatch!`);
      console.log(`   Expected: ${testOtp}`);
      console.log(`   Got: ${user.resetOtp}`);
      console.log(`   Match: ${user.resetOtp === testOtp}`);
      console.log(`   Type of stored: ${typeof user.resetOtp}`);
      console.log(`   Type of input: ${typeof testOtp}`);
    } else {
      console.log('\n✅ OTP matches!');
    }
    
    // Check if OTP is expired
    if (user.resetOtpExpire < Date.now()) {
      console.log(`\n❌ OTP Expired!`);
      console.log(`   Expired at: ${user.resetOtpExpire}`);
      console.log(`   Current time: ${Date.now()}`);
      console.log(`   Difference: ${Date.now() - user.resetOtpExpire}ms`);
    } else {
      console.log('\n✅ OTP not expired');
      console.log(`   Time remaining: ${Math.floor((user.resetOtpExpire - Date.now()) / 1000)}s`);
    }
    
    // Test the query that the backend uses
    console.log('\n🔍 Testing backend query...');
    const foundUser = await User.findOne({
      email: testEmail.toLowerCase(),
      resetOtp: testOtp,
      resetOtpExpire: { $gt: Date.now() }
    });
    
    if (foundUser) {
      console.log('✅ Backend query would succeed');
    } else {
      console.log('❌ Backend query would fail');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testOtpVerification();
