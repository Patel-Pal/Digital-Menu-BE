/**
 * Debug script to check shop data and ownerId consistency
 * Run with: node debug-shops.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./models/Shop');
const User = require('./models/User');

async function debugShops() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({});
    console.log(`=== USERS (${users.length}) ===`);
    users.forEach(user => {
      console.log(`${user.name} (${user.email})`);
      console.log(`  User _id: ${user._id}`);
      console.log(`  Role: ${user.role}`);
      console.log('');
    });

    // Get all shops
    const shops = await Shop.find({});
    console.log(`\n=== SHOPS (${shops.length}) ===`);
    shops.forEach(shop => {
      console.log(`${shop.name}`);
      console.log(`  Shop _id: ${shop._id}`);
      console.log(`  Owner ID: ${shop.ownerId}`);
      console.log(`  QR Scans: ${shop.qrScans}`);
      console.log(`  Menu Views: ${shop.menuViews}`);
      console.log('');
    });

    // Check for mismatches
    console.log('\n=== CHECKING OWNER ID MATCHES ===');
    for (const shop of shops) {
      const owner = users.find(u => u._id.toString() === shop.ownerId.toString());
      if (owner) {
        console.log(`✅ ${shop.name} → Owner: ${owner.name} (${owner.email})`);
      } else {
        console.log(`❌ ${shop.name} → Owner ID ${shop.ownerId} NOT FOUND in users!`);
      }
    }

    // Check for duplicate ownerIds
    console.log('\n=== CHECKING FOR DUPLICATE OWNER IDS ===');
    const ownerIdCounts = {};
    shops.forEach(shop => {
      const oid = shop.ownerId.toString();
      ownerIdCounts[oid] = (ownerIdCounts[oid] || 0) + 1;
    });

    Object.entries(ownerIdCounts).forEach(([ownerId, count]) => {
      if (count > 1) {
        console.log(`⚠️  Owner ID ${ownerId} is used by ${count} shops!`);
        const duplicateShops = shops.filter(s => s.ownerId.toString() === ownerId);
        duplicateShops.forEach(s => console.log(`   - ${s.name}`));
      }
    });

    if (Object.values(ownerIdCounts).every(c => c === 1)) {
      console.log('✅ No duplicate owner IDs found');
    }

    console.log('\n=== Debug Complete ===');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugShops();
