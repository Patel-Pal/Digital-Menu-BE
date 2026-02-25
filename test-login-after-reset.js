const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-menu')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');

async function testLoginAfterReset() {
  try {
    const testEmail = process.argv[2] || 'test@example.com';
    const testPassword = process.argv[3] || 'password123';
    
    console.log(`\nTesting login for: ${testEmail}`);
    console.log(`Password to test: ${testPassword}`);
    
    // Find user
    const user = await User.findOne({ email: testEmail.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('\n📋 User Details:');
    console.log(`- Email: ${user.email}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Stored Password Hash: ${user.password.substring(0, 30)}...`);
    console.log(`- Hash Length: ${user.password.length}`);
    
    // Test password comparison
    console.log('\n🔐 Testing Password Comparison:');
    const isMatch = await user.comparePassword(testPassword);
    console.log(`- Password Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    // Manual bcrypt comparison
    console.log('\n🔍 Manual bcrypt test:');
    const manualMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`- Manual Match: ${manualMatch ? '✅ YES' : '❌ NO'}`);
    
    // Test if password is double-hashed
    console.log('\n🔬 Checking for double-hashing:');
    const isValidBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    console.log(`- Valid bcrypt format: ${isValidBcryptHash ? '✅ YES' : '❌ NO'}`);
    
    if (!isMatch) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure you are using the NEW password you just set');
      console.log('2. Check for any extra spaces in the password');
      console.log('3. Password is case-sensitive');
      
      // Try to hash the input password and see what we get
      const testHash = await bcrypt.hash(testPassword, 12);
      console.log(`\n🧪 Test hash of "${testPassword}":`);
      console.log(`   ${testHash.substring(0, 30)}...`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testLoginAfterReset();
