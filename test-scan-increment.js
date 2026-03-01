/**
 * Test script to verify scan increment functionality
 * Run with: node test-scan-increment.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./models/Shop');

async function testScanIncrement() {
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all shops
    const shops = await Shop.find({});
    console.log(`Found ${shops.length} shops in database:\n`);

    shops.forEach((shop, index) => {
      console.log(`${index + 1}. ${shop.name}`);
      console.log(`   Shop _id: ${shop._id}`);
      console.log(`   Owner ID: ${shop.ownerId}`);
      console.log(`   QR Scans: ${shop.qrScans}`);
      console.log(`   Menu Views: ${shop.menuViews}`);
      console.log('');
    });

    if (shops.length === 0) {
      console.log('❌ No shops found in database!');
      process.exit(1);
    }

    // Test increment on first shop
    const testShop = shops[0];
    console.log(`\nTesting scan increment on: ${testShop.name}`);
    console.log(`Current scan count: ${testShop.qrScans}`);
    console.log(`Using ownerId: ${testShop.ownerId}\n`);

    // Increment using ownerId (same as API does)
    const updatedShop = await Shop.findOneAndUpdate(
      { ownerId: testShop.ownerId },
      { $inc: { qrScans: 1 } },
      { new: true }
    );

    if (updatedShop) {
      console.log('✅ Scan increment successful!');
      console.log(`New scan count: ${updatedShop.qrScans}`);
      console.log(`Increased by: ${updatedShop.qrScans - testShop.qrScans}`);
    } else {
      console.log('❌ Failed to update shop');
    }

    // Verify the update
    const verifyShop = await Shop.findById(testShop._id);
    console.log(`\nVerification - Current count in DB: ${verifyShop.qrScans}`);

    console.log('\n=== Test Complete ===');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testScanIncrement();
